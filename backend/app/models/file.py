"""File model for course/group uploads (RAG)."""
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class File(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id"), nullable=True, index=True)
    group_id: Mapped[int | None] = mapped_column(ForeignKey("groups.id"), nullable=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    uploaded_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="files")
    group = relationship("Group", back_populates="files")
    uploader = relationship("User", foreign_keys=[uploaded_by])
    chunks = relationship("DocumentChunk", back_populates="file", cascade="all, delete-orphan")
