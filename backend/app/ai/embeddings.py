"""Sentence-transformers embeddings. Model loaded once globally."""
from typing import List

_embedding_model = None

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    return _embedding_model


def encode(texts: List[str]) -> List[List[float]]:
    """Encode texts to embeddings. Returns list of vectors."""
    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True)
    return embeddings.tolist()


def encode_single(text: str) -> List[float]:
    """Encode a single string."""
    return encode([text])[0]
