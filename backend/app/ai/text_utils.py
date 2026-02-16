"""Text extraction from PDF/DOCX/TXT and chunking for RAG."""
import re
from pathlib import Path
from typing import List

# Approx 4 chars per token; target 500-800 tokens per chunk
CHUNK_TARGET_CHARS = 2400
CHUNK_OVERLAP_CHARS = 200


def extract_text_from_file(file_path: Path) -> str:
    """Extract plain text from PDF, DOCX, or TXT."""
    path = Path(file_path)
    suffix = path.suffix.lower()
    if suffix == ".txt":
        return path.read_text(encoding="utf-8", errors="replace")
    if suffix == ".pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(path)
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            return ""
    if suffix == ".docx":
        try:
            from docx import Document
            doc = Document(path)
            return "\n".join(p.text for p in doc.paragraphs)
        except Exception:
            return ""
    return ""


def chunk_text(text: str, target_chars: int = CHUNK_TARGET_CHARS, overlap: int = CHUNK_OVERLAP_CHARS) -> List[str]:
    """Split text into chunks of ~target_chars with optional overlap. Tries to break on paragraphs/sentences."""
    text = text.strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + target_chars
        if end >= len(text):
            chunk = text[start:].strip()
            if chunk:
                chunks.append(chunk)
            break
        # Prefer break at paragraph or sentence
        segment = text[start:end]
        break_at = -1
        for sep in ["\n\n", "\n", ". ", " "]:
            idx = segment.rfind(sep)
            if idx > target_chars // 2:
                break_at = idx + len(sep)
                break
        if break_at > 0:
            chunk = text[start : start + break_at].strip()
            start = start + break_at - overlap
        else:
            chunk = segment.strip()
            start = end - overlap
        if chunk:
            chunks.append(chunk)
    return chunks
