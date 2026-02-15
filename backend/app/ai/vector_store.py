"""FAISS vector store per course/group. Indexes stored under backend/vector_indexes/."""
import os
from pathlib import Path
from typing import List, Literal

import numpy as np

from app.config import VECTOR_INDEX_DIR

# Lazy import to avoid loading faiss before first use
_faiss = None

def _get_faiss():
    global _faiss
    if _faiss is None:
        import faiss
        _faiss = faiss
    return _faiss


def _index_path(scope: Literal["course", "group"], scope_id: int) -> Path:
    VECTOR_INDEX_DIR.mkdir(parents=True, exist_ok=True)
    return VECTOR_INDEX_DIR / f"{scope}_{scope_id}.index"


def _index_meta_path(scope: Literal["course", "group"], scope_id: int) -> Path:
    return VECTOR_INDEX_DIR / f"{scope}_{scope_id}.meta.txt"


def get_or_create_index(scope: Literal["course", "group"], scope_id: int, dimension: int):
    """Load existing FAISS index or create new one. dimension = embedding size (384 for MiniLM-L6)."""
    faiss = _get_faiss()
    path = _index_path(scope, scope_id)
    if path.exists():
        index = faiss.read_index(str(path))
        return index
    index = faiss.IndexFlatL2(dimension)
    return index


def add_vectors_to_index(
    scope: Literal["course", "group"],
    scope_id: int,
    vectors: np.ndarray,
    chunk_ids: List[int],
) -> None:
    """Append vectors to the scope index and persist. chunk_ids stored in meta file for retrieval."""
    if vectors is None or len(vectors) == 0:
        return
    faiss = _get_faiss()
    vectors = np.array(vectors, dtype=np.float32)
    if vectors.ndim == 1:
        vectors = vectors.reshape(1, -1)
    dimension = vectors.shape[1]

    index = get_or_create_index(scope, scope_id, dimension)
    start = index.ntotal
    index.add(vectors)

    meta_path = _index_meta_path(scope, scope_id)
    existing_ids = []
    if meta_path.exists():
        with open(meta_path, "r") as f:
            existing_ids = [int(line.strip()) for line in f if line.strip()]
    existing_ids.extend(chunk_ids)
    with open(meta_path, "w") as f:
        for i in existing_ids:
            f.write(f"{i}\n")

    faiss.write_index(index, str(_index_path(scope, scope_id)))


def search_index(
    scope: Literal["course", "group"],
    scope_id: int,
    query_vector: np.ndarray,
    top_k: int = 5,
) -> List[int]:
    """Return chunk_ids (from meta file) for top_k nearest vectors. query_vector shape (1, dim)."""
    path = _index_path(scope, scope_id)
    if not path.exists():
        return []
    faiss = _get_faiss()
    index = faiss.read_index(str(path))
    if index.ntotal == 0:
        return []
    query_vector = np.array(query_vector, dtype=np.float32)
    if query_vector.ndim == 1:
        query_vector = query_vector.reshape(1, -1)
    _, indices = index.search(query_vector, min(top_k, index.ntotal))
    indices = indices[0].tolist()

    meta_path = _index_meta_path(scope, scope_id)
    if not meta_path.exists():
        return []
    with open(meta_path, "r") as f:
        chunk_ids = [int(line.strip()) for line in f if line.strip()]
    return [chunk_ids[i] for i in indices if i < len(chunk_ids)]
