"""College endpoints: list colleges for dropdown."""
from fastapi import APIRouter

from app.data.mock_store import COLLEGES
from app.schemas.college_schema import CollegeResponse

router = APIRouter(prefix="/colleges", tags=["colleges"])


@router.get("", response_model=list[CollegeResponse])
def list_colleges():
    """Return list of available colleges for dropdown."""
    return [CollegeResponse(**c) for c in COLLEGES]
