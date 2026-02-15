"""Dashboard endpoint: college name, user email, enrolled courses."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import get_db
from app.dependencies import get_current_user
from app.models import College, Course, Enrollment
from app.schemas.dashboard_schema import DashboardCourseResponse, DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Return college name, user email, and list of enrolled courses."""
    college = db.query(College).filter(College.id == payload["college_id"]).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")

    enrollments = (
        db.query(Course)
        .join(Enrollment, Enrollment.course_id == Course.id)
        .filter(Enrollment.user_id == payload["user_id"])
        .filter(Course.college_id == payload["college_id"])
        .all()
    )

    return DashboardResponse(
        college_name=college.name,
        user_email=payload["email"],
        courses=[DashboardCourseResponse(id=c.id, name=c.name, code=c.code) for c in enrollments],
    )
