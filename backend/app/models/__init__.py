"""SQLAlchemy models."""
from app.database import Base
from app.models.college import College
from app.models.user import User, UserRole

__all__ = ["Base", "College", "User", "UserRole"]
