"""Schemas for AI/RAG endpoints."""
from pydantic import BaseModel


class AIQueryRequest(BaseModel):
    question: str


class AIQueryResponse(BaseModel):
    answer: str


class AIVoiceQueryResponse(BaseModel):
    """AI query with TTS audio for voice channel Ask AI."""

    answer: str
    audio_base64: str | None = None  # mp3 base64 when ElevenLabs configured


class AISummaryResponse(BaseModel):
    summary: str
