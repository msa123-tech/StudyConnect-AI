"""Course message model."""
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CourseMessage(Base):
    __tablename__ = "course_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="course_messages")
    user = relationship("User", back_populates="course_messages")
