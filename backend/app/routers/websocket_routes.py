"""WebSocket endpoints for course and group chat."""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Course, CourseMessage, Enrollment, Group, GroupMember, GroupMessage, User
from app.utils.jwt_handler import decode_access_token
from app.websocket_manager import (
    add_course_connection,
    add_group_connection,
    broadcast_course_message,
    broadcast_group_message,
    remove_course_connection,
    remove_group_connection,
)

router = APIRouter(tags=["websocket"])
MAX_MESSAGE_LENGTH = 4096


def _verify_course_access(db: Session, user_id: int, college_id: int, course_id: int) -> User | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course or course.college_id != college_id:
        return None
    enrolled = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrolled:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user


def _verify_group_access(db: Session, user_id: int, college_id: int, group_id: int) -> User | None:
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return None
    course = db.query(Course).filter(Course.id == group.course_id).first()
    if not course or course.college_id != college_id:
        return None
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
    ).first()
    if not member:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user


@router.websocket("/ws/course/{course_id}")
async def course_chat(websocket: WebSocket, course_id: int):
    """Real-time course chat. Query param: token=JWT"""
    token = websocket.query_params.get("token") or websocket.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        await websocket.close(code=4001)
        return

    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=4001)
        return

    db = SessionLocal()
    try:
        user = _verify_course_access(db, payload["user_id"], payload["college_id"], course_id)
        if not user:
            await websocket.close(code=4003)
            return

        await add_course_connection(course_id, websocket)

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                content = (msg.get("content") or "").strip()[:MAX_MESSAGE_LENGTH]
                if not content:
                    continue

                # Save to DB first
                cm = CourseMessage(course_id=course_id, user_id=user.id, content=content)
                db.add(cm)
                db.commit()
                db.refresh(cm)

                # Broadcast to all connections
                broadcast_msg = {
                    "user_email": user.email,
                    "content": content,
                    "timestamp": cm.created_at.isoformat() if cm.created_at else None,
                }
                await broadcast_course_message(course_id, broadcast_msg)
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        remove_course_connection(course_id, websocket)
        db.close()


@router.websocket("/ws/group/{group_id}")
async def group_chat(websocket: WebSocket, group_id: int):
    """Real-time group chat. Query param: token=JWT"""
    token = websocket.query_params.get("token") or websocket.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        await websocket.close(code=4001)
        return

    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=4001)
        return

    db = SessionLocal()
    try:
        user = _verify_group_access(db, payload["user_id"], payload["college_id"], group_id)
        if not user:
            await websocket.close(code=4003)
            return

        await add_group_connection(group_id, websocket)

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                content = (msg.get("content") or "").strip()[:MAX_MESSAGE_LENGTH]
                if not content:
                    continue

                # Save to DB first
                gm = GroupMessage(group_id=group_id, user_id=user.id, content=content)
                db.add(gm)
                db.commit()
                db.refresh(gm)

                # Broadcast
                broadcast_msg = {
                    "user_email": user.email,
                    "content": content,
                    "timestamp": gm.created_at.isoformat() if gm.created_at else None,
                }
                await broadcast_group_message(group_id, broadcast_msg)
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        remove_group_connection(group_id, websocket)
        db.close()
