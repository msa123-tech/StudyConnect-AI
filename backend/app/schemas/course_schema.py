"""Course and group schemas."""
from pydantic import BaseModel


class GroupResponse(BaseModel):
    id: int
    name: str | None
    course_id: int

    class Config:
        from_attributes = True


class VoiceChannelResponse(BaseModel):
    id: int
    name: str
    course_id: int

    class Config:
        from_attributes = True


class CoursePageResponse(BaseModel):
    course_info: dict
    groups: list[GroupResponse]
    voice_channels: list[VoiceChannelResponse] | None = None


class CreateGroupRequest(BaseModel):
    name: str
