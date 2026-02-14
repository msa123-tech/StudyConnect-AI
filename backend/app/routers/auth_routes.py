"""Auth endpoints: login (auto-create user), me (protected)."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated

from app.data.mock_store import (
    COLLEGES,
    create_user,
    get_college_by_id,
    get_user_by_email,
)
from app.dependencies import get_current_user
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserMeResponse
from app.utils.email_validator import validate_email_domain
from app.utils.jwt_handler import create_access_token
from app.utils.password_handler import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    """
    Validate email matches college domain.
    If new user → auto create in memory. Hash password, generate JWT.
    Return token + college name.
    """
    email = body.email.strip().lower()
    college = get_college_by_id(body.college_id)
    if not college:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid college_id",
        )
    if not validate_email_domain(email, college):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email must end with @{college['domain']}",
        )

    user = get_user_by_email(email)
    if not user:
        # Auto-create new user (Phase 2: auto account creation)
        password_hash = hash_password(body.password)
        user = create_user(email, password_hash, body.college_id)
    else:
        if user["college_id"] != body.college_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email does not belong to this college",
            )
        if not verify_password(body.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
            )

    token = create_access_token(
        data={
            "user_id": user["user_id"],
            "college_id": user["college_id"],
            "email": user["email"],
        }
    )
    return TokenResponse(
        access_token=token,
        college_name=college["name"],
    )


@router.get("/me", response_model=UserMeResponse)
def me(payload: Annotated[dict, Depends(get_current_user)]):
    """Protected route. Requires JWT. Returns email, college_id, college_name."""
    college = get_college_by_id(payload["college_id"])
    college_name = college["name"] if college else "Unknown"
    return UserMeResponse(
        email=payload["email"],
        college_id=payload["college_id"],
        college_name=college_name,
    )
