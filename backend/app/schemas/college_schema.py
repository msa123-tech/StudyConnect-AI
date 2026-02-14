"""College schemas."""
from pydantic import BaseModel


class CollegeResponse(BaseModel):
    id: int
    name: str
    short_name: str
    domain: str

    class Config:
        from_attributes = True
