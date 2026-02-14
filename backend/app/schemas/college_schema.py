"""College schemas."""
from pydantic import BaseModel


class CollegeResponse(BaseModel):
    id: int
    name: str
    domain: str
