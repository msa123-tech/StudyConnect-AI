"""In-memory WebSocket connection manager for course and group chat."""
import json
from collections import defaultdict
from fastapi import WebSocket

# course_id -> list of WebSocket connections
course_connections: dict[int, list[WebSocket]] = defaultdict(list)
# group_id -> list of WebSocket connections
group_connections: dict[int, list[WebSocket]] = defaultdict(list)


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
