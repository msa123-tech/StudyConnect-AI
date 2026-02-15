"""Dashboard schemas."""
from pydantic import BaseModel


class DashboardCourseResponse(BaseModel):
    id: int
    name: str
    code: str | None

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    college_name: str
    user_email: str
    courses: list[DashboardCourseResponse]
