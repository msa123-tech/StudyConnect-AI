"""RAG query and course summary endpoints."""
import base64
import logging
from typing import Annotated

import httpx

logger = logging.getLogger(__name__)
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.embeddings import encode_single
from app.ai.llama_client import OllamaUnavailableError
from app.ai.rag import course_summary_rag, get_chunk_texts_by_ids, query_rag
from app.ai.vector_store import search_index
from app.config import ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
from app.database import get_db
from app.dependencies import get_current_user
from app.models import CourseMessage, User
from app.routers.course_routes import _verify_enrollment, _verify_group_membership
from app.schemas.ai_schema import AIQueryRequest, AIQueryResponse, AISummaryResponse, AIVoiceQueryResponse

router = APIRouter(tags=["ai"])


@router.post("/courses/{course_id}/ai/query", response_model=AIQueryResponse)
async def course_ai_query(
    course_id: int,
    body: AIQueryRequest,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """RAG query over course materials and recent chat. Uses local LLaMA."""
    _verify_enrollment(db, payload["user_id"], course_id, payload["college_id"])
    if not body.question or not body.question.strip():
        raise HTTPException(400, "question is required")
    # Include last 50 course messages so Ask AI can answer questions about the chat
    messages = (
        db.query(CourseMessage, User.email)
        .join(User, User.id == CourseMessage.user_id)
        .filter(CourseMessage.course_id == course_id)
        .order_by(CourseMessage.created_at.desc())
        .limit(50)
        .all()
    )
    messages = list(reversed(messages))  # chronological
    recent_chat = "\n".join(f"{email}: {m.content}" for m, email in messages) if messages else ""
    try:
        answer = await query_rag(
            db, "course", course_id, body.question.strip(),
            recent_chat_snippet=recent_chat or None,
        )
    except OllamaUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable.") from e
    return AIQueryResponse(answer=answer)


@router.post("/courses/{course_id}/ai/voice-query", response_model=AIVoiceQueryResponse)
async def course_ai_voice_query(
    course_id: int,
    body: AIQueryRequest,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """RAG query + ElevenLabs TTS for voice channel Ask AI. Returns answer and optional audio_base64."""
    _verify_enrollment(db, payload["user_id"], course_id, payload["college_id"])
    if not body.question or not body.question.strip():
        raise HTTPException(400, "question is required")

    print(f"[Voice] Received question: \"{body.question.strip()}\"", flush=True)

    messages = (
        db.query(CourseMessage, User.email)
        .join(User, User.id == CourseMessage.user_id)
        .filter(CourseMessage.course_id == course_id)
        .order_by(CourseMessage.created_at.desc())
        .limit(50)
        .all()
    )
    messages = list(reversed(messages))
    recent_chat = "\n".join(f"{email}: {m.content}" for m, email in messages) if messages else ""

    try:
        answer = await query_rag(
            db, "course", course_id, body.question.strip(),
            recent_chat_snippet=recent_chat or None,
        )
    except OllamaUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable.") from e

    audio_base64 = None
    api_key = (ELEVENLABS_API_KEY or "").strip()
    if api_key and api_key != "YOUR_ELEVENLABS_API_KEY" and answer:
        # Try cheaper models first (eleven_turbo_v2), fall back to multilingual
        models_to_try = ["eleven_turbo_v2", "eleven_multilingual_v2"]
        # Free tier has ~20 credits: turbo = 1 credit/2 chars, multilingual = 1 credit/char
        text_for_tts = answer[:40]  # ~20 credits with turbo, fits free tier
        for model_id in models_to_try:
            try:
                print(f"[ElevenLabs] Calling TTS with model={model_id}...", flush=True)
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
                        headers={
                            "xi-api-key": api_key,
                            "Content-Type": "application/json",
                            "Accept": "audio/mpeg",
                        },
                        json={"text": text_for_tts, "model_id": model_id},
                    )
                    if resp.status_code == 200:
                        audio_base64 = base64.b64encode(resp.content).decode("utf-8")
                        print(f"[ElevenLabs] TTS OK, model={model_id}, {len(resp.content)} bytes", flush=True)
                        break
                    else:
                        print(f"[ElevenLabs] TTS FAILED model={model_id}: status={resp.status_code} body={resp.text[:300]}", flush=True)
            except Exception as e:
                print(f"[ElevenLabs] TTS error model={model_id}: {e}", flush=True)
    elif not api_key or api_key == "YOUR_ELEVENLABS_API_KEY":
        print("[ElevenLabs] API key not configured; text-only response", flush=True)

    return AIVoiceQueryResponse(answer=answer, audio_base64=audio_base64)


@router.post("/groups/{group_id}/ai/query", response_model=AIQueryResponse)
async def group_ai_query(
    group_id: int,
    body: AIQueryRequest,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """RAG query over group materials. Uses local LLaMA."""
    _verify_group_membership(db, payload["user_id"], group_id, payload["college_id"])
    if not body.question or not body.question.strip():
        raise HTTPException(400, "question is required")
    try:
        answer = await query_rag(db, "group", group_id, body.question.strip())
    except OllamaUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable.") from e
    return AIQueryResponse(answer=answer)


@router.post("/courses/{course_id}/ai/summary", response_model=AISummaryResponse)
async def course_ai_summary(
    course_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Summarize last 50 course messages + top document chunks. Uses local LLaMA."""
    _verify_enrollment(db, payload["user_id"], course_id, payload["college_id"])

    messages = (
        db.query(CourseMessage)
        .filter(CourseMessage.course_id == course_id)
        .order_by(CourseMessage.created_at.desc())
        .limit(50)
        .all()
    )
    messages = list(reversed(messages))
    chat_snippet = "\n".join(m.content for m in messages) if messages else "No discussion yet."

    # Top 5 chunks: use a generic query to get 5 relevant chunks, or first 5 from index
    try:
        query_vec = encode_single("summary overview key points")
        query_vec_np = np.array([query_vec], dtype=np.float32)
        chunk_ids = search_index("course", course_id, query_vec_np, top_k=5)
        top_chunk_texts = get_chunk_texts_by_ids(db, chunk_ids)
        summary = await course_summary_rag(db, course_id, chat_snippet, top_chunk_texts)
    except OllamaUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable.") from e
    return AISummaryResponse(summary=summary)
