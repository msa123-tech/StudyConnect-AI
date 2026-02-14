"""Auth endpoints: login (auto-create user), me (protected)."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import get_db
from app.dependencies import get_current_user
from app.models import College, User, UserRole
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserMeResponse
from app.utils.email_validator import validate_email_domain
from app.utils.jwt_handler import create_access_token
from app.utils.password_handler import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    Validate email matches college domain.
    If new user → auto create in DB. Hash password, generate JWT.
    Return token + college name.
    """
    email = body.email.strip().lower()
    college = db.query(College).filter(College.id == body.college_id, College.status == True).first()
    if not college:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid college_id",
        )
    if not validate_email_domain(email, {"domain": college.domain}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email must end with @{college.domain}",
        )

    user = db.query(User).filter(User.email == email, User.college_id == body.college_id).first()
    if not user:
        password_hash = hash_password(body.password)
        user = User(
            email=email,
            hashed_password=password_hash,
            college_id=body.college_id,
            role=UserRole.student,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not verify_password(body.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
            )

    token = create_access_token(
        data={
            "user_id": user.id,
            "college_id": user.college_id,
            "email": user.email,
        }
    )
    return TokenResponse(
        access_token=token,
        college_name=college.name,
    )


@router.get("/me", response_model=UserMeResponse)
def me(payload: Annotated[dict, Depends(get_current_user)], db: Session = Depends(get_db)):
    """Protected route. Requires JWT. Returns email, college_id, college_name."""
    college = db.query(College).filter(College.id == payload["college_id"]).first()
    college_name = college.name if college else "Unknown"
    return UserMeResponse(
        email=payload["email"],
        college_id=payload["college_id"],
        college_name=college_name,
    )
