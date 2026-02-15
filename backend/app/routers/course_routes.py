"""Course and group endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Annotated

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Course, CourseMessage, Enrollment, Group, GroupMember, GroupMessage, User
from app.schemas.course_schema import CreateGroupRequest, CoursePageResponse, GroupResponse

router = APIRouter(tags=["courses"])


def _verify_enrollment(db: Session, user_id: int, course_id: int, college_id: int) -> Course:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.college_id != college_id:
        raise HTTPException(status_code=403, detail="Course does not belong to your college")
    enrolled = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrolled:
        raise HTTPException(status_code=403, detail="You are not enrolled in this course")
    return course


@router.get("/courses/{course_id}", response_model=CoursePageResponse)
def get_course(
    course_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Return course info and groups. Requires enrollment and college match."""
    course = _verify_enrollment(
        db, payload["user_id"], course_id, payload["college_id"]
    )
    groups = db.query(Group).filter(Group.course_id == course_id).all()
    return CoursePageResponse(
        course_info={
            "id": course.id,
            "name": course.name,
            "code": course.code,
            "description": course.description,
            "college_id": course.college_id,
        },
        groups=[GroupResponse(id=g.id, name=g.name, course_id=g.course_id) for g in groups],
    )


@router.post("/courses/{course_id}/groups", response_model=GroupResponse)
def create_group(
    course_id: int,
    body: CreateGroupRequest,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Create a study group. Requires enrollment. Creator is auto-added as member."""
    course = _verify_enrollment(
        db, payload["user_id"], course_id, payload["college_id"]
    )
    group = Group(
        course_id=course_id,
        name=body.name.strip() or "Study Group",
        created_by=payload["user_id"],
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    # Add creator as member
    member = GroupMember(group_id=group.id, user_id=payload["user_id"])
    db.add(member)
    db.commit()
    return GroupResponse(id=group.id, name=group.name, course_id=group.course_id)


@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Return group info. Requires enrollment in the course."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    _verify_enrollment(
        db, payload["user_id"], group.course_id, payload["college_id"]
    )
    return GroupResponse(id=group.id, name=group.name, course_id=group.course_id)


@router.post("/groups/{group_id}/join", response_model=GroupResponse)
def join_group(
    group_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """Join a group. Requires enrollment in the course and college match."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    course = _verify_enrollment(
        db, payload["user_id"], group.course_id, payload["college_id"]
    )
    existing = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == payload["user_id"],
    ).first()
    if existing:
        return GroupResponse(id=group.id, name=group.name, course_id=group.course_id)
    member = GroupMember(group_id=group_id, user_id=payload["user_id"])
    db.add(member)
    db.commit()
    db.refresh(group)
    return GroupResponse(id=group.id, name=group.name, course_id=group.course_id)


@router.get("/courses/{course_id}/messages")
def get_course_messages(
    course_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    limit: int = Query(100, le=200),
):
    """Fetch course message history for chat."""
    _verify_enrollment(
        db, payload["user_id"], course_id, payload["college_id"]
    )
    messages = (
        db.query(CourseMessage)
        .filter(CourseMessage.course_id == course_id)
        .order_by(CourseMessage.created_at.desc())
        .limit(limit)
        .all()
    )
    messages = list(reversed(messages))
    return [
        {
            "user_email": db.query(User).filter(User.id == m.user_id).first().email,
            "content": m.content,
            "timestamp": m.created_at.isoformat() if m.created_at else None,
        }
        for m in messages
    ]


@router.get("/groups/{group_id}/messages")
def get_group_messages(
    group_id: int,
    payload: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    limit: int = Query(100, le=200),
):
    """Fetch group message history for chat."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    _verify_enrollment(
        db, payload["user_id"], group.course_id, payload["college_id"]
    )
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == payload["user_id"],
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this group")
    messages = (
        db.query(GroupMessage)
        .filter(GroupMessage.group_id == group_id)
        .order_by(GroupMessage.created_at.desc())
        .limit(limit)
        .all()
    )
    messages = list(reversed(messages))
    return [
        {
            "user_email": db.query(User).filter(User.id == m.user_id).first().email,
            "content": m.content,
            "timestamp": m.created_at.isoformat() if m.created_at else None,
        }
        for m in messages
    ]
