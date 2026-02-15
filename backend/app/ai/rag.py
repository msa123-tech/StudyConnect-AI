"""RAG: retrieve chunks, build prompt, call LLaMA."""
from typing import List

import numpy as np
from sqlalchemy.orm import Session

from app.ai.embeddings import encode_single
from app.ai.llama_client import generate
from app.ai.vector_store import search_index
from app.models import DocumentChunk

RAG_TOP_K = 5
PROMPT_TEMPLATE = """Using the following context (recent course discussion and/or uploaded materials), answer the question. If the answer is not found in the context, say you don't know.

Context:
{context}

Question:
{question}"""


def get_chunk_texts_by_ids(db: Session, chunk_ids: List[int]) -> List[str]:
    """Fetch chunk texts by ids. Preserves order of chunk_ids."""
    if not chunk_ids:
        return []
    chunks = db.query(DocumentChunk).filter(DocumentChunk.id.in_(chunk_ids)).all()
    id_to_chunk = {c.id: c for c in chunks}
    return [id_to_chunk[cid].chunk_text for cid in chunk_ids if cid in id_to_chunk]


async def query_rag(
    db: Session,
    scope: str,
    scope_id: int,
    question: str,
    recent_chat_snippet: str | None = None,
) -> str:
    """Embed question, retrieve top chunks, build prompt, generate answer.
    For course scope, pass recent_chat_snippet to include course chat in context.
    """
    scope_type = "course" if scope == "course" else "group"
    query_vec = encode_single(question)
    query_vec_np = np.array([query_vec], dtype=np.float32)

    chunk_ids = search_index(scope_type, scope_id, query_vec_np, top_k=RAG_TOP_K)
    chunk_texts = get_chunk_texts_by_ids(db, chunk_ids)

    parts = []
    if recent_chat_snippet and recent_chat_snippet.strip():
        parts.append("Recent course discussion:\n" + recent_chat_snippet.strip())
    if chunk_texts:
        parts.append("Course materials (from uploads):\n" + "\n\n".join(chunk_texts))
    if not parts:
        parts.append("No recent discussion or uploaded materials.")
    context = "\n\n---\n\n".join(parts)
    prompt = PROMPT_TEMPLATE.format(context=context, question=question)
    return await generate(prompt)


SUMMARY_PROMPT_TEMPLATE = """Summarize the following course discussion and materials for students. Be concise and highlight key points.

Recent discussion:
{chat_snippet}

Relevant materials:
{materials}

Provide a short summary (a few sentences)."""


async def course_summary_rag(
    db: Session,
    course_id: int,
    chat_snippet: str,
    top_chunk_texts: List[str],
) -> str:
    """Generate course summary from chat snippet + materials."""
    materials = "\n\n".join(top_chunk_texts) if top_chunk_texts else "No uploaded materials."
    prompt = SUMMARY_PROMPT_TEMPLATE.format(
        chat_snippet=chat_snippet,
        materials=materials,
    )
    return await generate(prompt)
