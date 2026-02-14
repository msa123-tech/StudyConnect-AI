"""College endpoints: list colleges for dropdown."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import College
from app.schemas.college_schema import CollegeResponse

router = APIRouter(prefix="/colleges", tags=["colleges"])


@router.get("", response_model=list[CollegeResponse])
def list_colleges(db: Session = Depends(get_db)):
    """Return list of available colleges for dropdown."""
    colleges = db.query(College).filter(College.status == True).all()
    return [CollegeResponse.model_validate(c) for c in colleges]
