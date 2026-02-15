"""WebSocket endpoints for course and group chat."""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Course, CourseMessage, Enrollment, Group, GroupMember, GroupMessage, User, VoiceChannel
from app.utils.jwt_handler import decode_access_token
from app.websocket_manager import (
    VoicePeer,
    add_course_connection,
    add_group_connection,
    add_voice_peer,
    broadcast_course_message,
    broadcast_group_message,
    broadcast_voice_signal,
    get_voice_peer_ids,
    remove_course_connection,
    remove_group_connection,
    remove_voice_peer,
    send_to_voice_peer,
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


def _verify_voice_channel_access(db: Session, user_id: int, college_id: int, channel_id: int) -> tuple[User | None, int | None]:
    """Verify user can access voice channel. Returns (User, course_id) or (None, None)."""
    channel = db.query(VoiceChannel).filter(VoiceChannel.id == channel_id).first()
    if not channel:
        return None, None
    course = db.query(Course).filter(Course.id == channel.course_id).first()
    if not course or course.college_id != college_id:
        return None, None
    enrolled = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == channel.course_id,
    ).first()
    if not enrolled:
        return None, None
    user = db.query(User).filter(User.id == user_id).first()
    return user, channel.course_id


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


@router.websocket("/ws/voice/{channel_id}")
async def voice_signaling(websocket: WebSocket, channel_id: int):
    """WebRTC signaling for voice channels. Query param: token=JWT. Relays SDP and ICE only."""
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
        user, _ = _verify_voice_channel_access(db, payload["user_id"], payload["college_id"], channel_id)
        if not user:
            await websocket.close(code=4003)
            return

        await websocket.accept()
        peer = VoicePeer(websocket=websocket, user_id=user.id, user_email=user.email)
        add_voice_peer(channel_id, peer)

        # Send existing peers to new joiner so they can create offers
        existing = get_voice_peer_ids(channel_id, exclude_user_id=user.id)
        await websocket.send_json({"type": "peers", "peers": existing})

        # Notify others that this user joined
        await broadcast_voice_signal(channel_id, {
            "type": "user_joined",
            "user_id": user.id,
            "user_email": user.email,
        }, exclude_ws=websocket)

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                msg_type = msg.get("type")
                from_user_id = user.id
                from_user_email = user.email
                target_user_id = msg.get("target_user_id")

                if msg_type == "offer":
                    relay = {"type": "offer", "from_user_id": from_user_id, "from_user_email": from_user_email, "sdp": msg.get("sdp")}
                elif msg_type == "answer":
                    relay = {"type": "answer", "from_user_id": from_user_id, "from_user_email": from_user_email, "sdp": msg.get("sdp")}
                elif msg_type == "ice":
                    relay = {"type": "ice", "from_user_id": from_user_id, "from_user_email": from_user_email, "candidate": msg.get("candidate")}
                else:
                    continue

                if target_user_id is not None:
                    await send_to_voice_peer(channel_id, target_user_id, relay)
                else:
                    await broadcast_voice_signal(channel_id, relay, exclude_ws=websocket)
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        remove_voice_peer(channel_id, websocket)
        if user:
            try:
                await broadcast_voice_signal(channel_id, {"type": "user_left", "user_id": user.id})
            except Exception:
                pass
        db.close()
