"""Group model."""
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="groups")
    creator = relationship("User", foreign_keys=[created_by])
    members = relationship("GroupMember", back_populates="group")
    messages = relationship("GroupMessage", back_populates="group")
