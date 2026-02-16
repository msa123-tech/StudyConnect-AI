"""In-memory WebSocket connection manager for course and group chat."""
import json
from collections import defaultdict
from typing import NamedTuple

from fastapi import WebSocket

# course_id -> list of WebSocket connections
course_connections: dict[int, list[WebSocket]] = defaultdict(list)
# group_id -> list of WebSocket connections
group_connections: dict[int, list[WebSocket]] = defaultdict(list)


class VoicePeer(NamedTuple):
    """Voice channel peer: websocket + user info for signaling."""

    websocket: WebSocket
    user_id: int
    user_email: str


# channel_id -> list of VoicePeer
voice_connections: dict[int, list[VoicePeer]] = defaultdict(list)


async def add_course_connection(course_id: int, ws: WebSocket):
    await ws.accept()
    course_connections[course_id].append(ws)


def remove_course_connection(course_id: int, ws: WebSocket):
    if course_id in course_connections:
        try:
            course_connections[course_id].remove(ws)
        except ValueError:
            pass
        if not course_connections[course_id]:
            del course_connections[course_id]


async def broadcast_course_message(course_id: int, message: dict):
    for ws in course_connections.get(course_id, []):
        try:
            await ws.send_json(message)
        except Exception:
            pass


async def add_group_connection(group_id: int, ws: WebSocket):
    await ws.accept()
    group_connections[group_id].append(ws)


def remove_group_connection(group_id: int, ws: WebSocket):
    if group_id in group_connections:
        try:
            group_connections[group_id].remove(ws)
        except ValueError:
            pass
        if not group_connections[group_id]:
            del group_connections[group_id]


async def broadcast_group_message(group_id: int, message: dict):
    for ws in group_connections.get(group_id, []):
        try:
            await ws.send_json(message)
        except Exception:
            pass


def add_voice_peer(channel_id: int, peer: VoicePeer) -> None:
    """Add a voice channel peer (caller must accept ws first)."""
    voice_connections[channel_id].append(peer)


def remove_voice_peer(channel_id: int, ws: WebSocket) -> None:
    """Remove a voice channel peer on disconnect."""
    if channel_id in voice_connections:
        voice_connections[channel_id] = [
            p for p in voice_connections[channel_id] if p.websocket is not ws
        ]
        if not voice_connections[channel_id]:
            del voice_connections[channel_id]


async def broadcast_voice_signal(channel_id: int, message: dict, exclude_ws: WebSocket | None = None):
    """Broadcast signaling message to all peers in channel except exclude_ws."""
    for peer in voice_connections.get(channel_id, []):
        if peer.websocket is exclude_ws:
            continue
        try:
            await peer.websocket.send_json(message)
        except Exception:
            pass


async def send_to_voice_peer(channel_id: int, target_user_id: int, message: dict) -> bool:
    """Send signaling message to a specific peer in channel. Returns True if sent."""
    for peer in voice_connections.get(channel_id, []):
        if peer.user_id == target_user_id:
            try:
                await peer.websocket.send_json(message)
                return True
            except Exception:
                pass
            return False
    return False


def get_voice_peer_ids(channel_id: int, exclude_user_id: int | None = None) -> list[dict]:
    """Return list of {user_id, user_email} for peers in channel, excluding exclude_user_id."""
    peers = []
    for peer in voice_connections.get(channel_id, []):
        if exclude_user_id is not None and peer.user_id == exclude_user_id:
            continue
        peers.append({"user_id": peer.user_id, "user_email": peer.user_email})
    return peers
