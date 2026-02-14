"""JWT token creation and verification."""
from datetime import datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT access token. data should include user_id, college_id, email."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    to_encode["iat"] = datetime.utcnow()
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token if isinstance(token, str) else token.decode("utf-8")


def decode_access_token(token: str) -> dict[str, Any] | None:
    """Decode and verify JWT. Returns payload or None if invalid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
