"""Enrollment model."""
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_user_course"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
