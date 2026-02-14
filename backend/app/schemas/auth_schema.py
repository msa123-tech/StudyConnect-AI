"""Auth request/response schemas."""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str
    college_id: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    college_name: str


class UserMeResponse(BaseModel):
    email: str
    college_id: int
    college_name: str
