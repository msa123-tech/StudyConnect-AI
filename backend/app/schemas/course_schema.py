"""Course and group schemas."""
from pydantic import BaseModel


class GroupResponse(BaseModel):
    id: int
    name: str | None
    course_id: int

    class Config:
        from_attributes = True


class CoursePageResponse(BaseModel):
    course_info: dict
    groups: list[GroupResponse]


class CreateGroupRequest(BaseModel):
    name: str
