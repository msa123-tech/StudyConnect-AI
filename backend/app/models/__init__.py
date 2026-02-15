"""SQLAlchemy models."""
from app.database import Base
from app.models.college import College
from app.models.user import User, UserRole
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.course_message import CourseMessage
from app.models.group import Group
from app.models.group_member import GroupMember
from app.models.group_message import GroupMessage

__all__ = [
    "Base", "College", "User", "UserRole",
    "Course", "Enrollment", "CourseMessage",
    "Group", "GroupMember", "GroupMessage",
]
