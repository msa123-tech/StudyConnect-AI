"""File upload for courses and groups (RAG)."""
import uuid
from pathlib import Path
from typing import Annotated

import numpy as np
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, UPLOAD_DIR
from app.database import get_db
from app.dependencies import get_current_user
from app.models import File as FileModel
from app.models import DocumentChunk
from app.routers.course_routes import _verify_enrollment, _verify_group_membership
from app.ai.embeddings import encode
from app.ai.text_utils import chunk_text, extract_text_from_file
from app.ai.vector_store import add_vectors_to_index

router = APIRouter(tags=["uploads"])

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


@router.post("/courses/{course_id}/upload")
async def upload_course_file(
    course_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
):
    """Upload PDF/DOCX/TXT for course. Extracts text, chunks, embeds, adds to FAISS."""
    _verify_enrollment(db, payload["user_id"], course_id, payload["college_id"])
    if not file.filename or not _allowed_file(file.filename):
        raise HTTPException(400, "Allowed types: PDF, DOCX, TXT")
    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, f"File too large. Max {MAX_UPLOAD_BYTES // 1_000_000} MB")
    safe_name = f"course_{course_id}_{uuid.uuid4().hex[:12]}{Path(file.filename).suffix}"
    path = UPLOAD_DIR / safe_name
    path.write_bytes(content)

    text = extract_text_from_file(path)
    if not text or not text.strip():
        path.unlink(missing_ok=True)
        raise HTTPException(400, "Could not extract text from file")
    chunks = chunk_text(text)
    if not chunks:
        path.unlink(missing_ok=True)
        raise HTTPException(400, "No content to index")

    file_record = FileModel(
        course_id=course_id,
        group_id=None,
        filename=file.filename,
        file_path=str(path),
        uploaded_by=payload["user_id"],
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    chunk_records = [DocumentChunk(file_id=file_record.id, chunk_text=c) for c in chunks]
    for cr in chunk_records:
        db.add(cr)
    db.commit()
    for cr in chunk_records:
        db.refresh(cr)

    embeddings = encode(chunks)
    vectors = np.array(embeddings, dtype=np.float32)
    add_vectors_to_index("course", course_id, vectors, [c.id for c in chunk_records])

    return {"file_id": file_record.id, "filename": file.filename, "chunks": len(chunks)}


@router.post("/groups/{group_id}/upload")
async def upload_group_file(
    group_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
):
    """Upload PDF/DOCX/TXT for group. Extracts text, chunks, embeds, adds to FAISS."""
    _verify_group_membership(db, payload["user_id"], group_id, payload["college_id"])
    if not file.filename or not _allowed_file(file.filename):
        raise HTTPException(400, "Allowed types: PDF, DOCX, TXT")
    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, f"File too large. Max {MAX_UPLOAD_BYTES // 1_000_000} MB")
    safe_name = f"group_{group_id}_{uuid.uuid4().hex[:12]}{Path(file.filename).suffix}"
    path = UPLOAD_DIR / safe_name
    path.write_bytes(content)

    text = extract_text_from_file(path)
    if not text or not text.strip():
        path.unlink(missing_ok=True)
        raise HTTPException(400, "Could not extract text from file")
    chunks = chunk_text(text)
    if not chunks:
        path.unlink(missing_ok=True)
        raise HTTPException(400, "No content to index")

    file_record = FileModel(
        course_id=None,
        group_id=group_id,
        filename=file.filename,
        file_path=str(path),
        uploaded_by=payload["user_id"],
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    chunk_records = [DocumentChunk(file_id=file_record.id, chunk_text=c) for c in chunks]
    for cr in chunk_records:
        db.add(cr)
    db.commit()
    for cr in chunk_records:
        db.refresh(cr)

    embeddings = encode(chunks)
    vectors = np.array(embeddings, dtype=np.float32)
    add_vectors_to_index("group", group_id, vectors, [c.id for c in chunk_records])

    return {"file_id": file_record.id, "filename": file.filename, "chunks": len(chunks)}
