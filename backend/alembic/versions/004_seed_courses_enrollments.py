"""Seed demo courses and enroll test users.

Revision ID: 004
Revises: 003
Create Date: 2026-02-14

"""
from typing import Sequence, Union

from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Demo courses for college_id 1 (GMU) - shared demo data
    op.execute("""
        INSERT INTO courses (college_id, name, code, description)
        VALUES
            (1, 'CS 550 Machine Learning', 'CS550', 'Introduction to machine learning'),
            (1, 'CS 483 Algorithms', 'CS483', 'Design and analysis of algorithms'),
            (1, 'CS 310 Data Structures', 'CS310', 'Data structures and algorithms')
    """)
    # Enroll all existing users in college 1 into course 1 (for demo - quick fix)
    # We enroll user ids 1-10 (our seed users) into course 1
    op.execute("""
        INSERT INTO enrollments (user_id, course_id)
        SELECT id, 1 FROM users WHERE college_id = 1
    """)
    # Also enroll GMU users in courses 2 and 3
    op.execute("""
        INSERT INTO enrollments (user_id, course_id)
        SELECT id, 2 FROM users WHERE college_id = 1
    """)
    op.execute("""
        INSERT INTO enrollments (user_id, course_id)
        SELECT id, 3 FROM users WHERE college_id = 1
    """)
    # Add same courses for other colleges (shared demo)
    op.execute("""
        INSERT INTO courses (college_id, name, code, description)
        SELECT id, 'CS 550 Machine Learning', 'CS550', 'Introduction to machine learning'
        FROM colleges WHERE id > 1
    """)
    op.execute("""
        INSERT INTO courses (college_id, name, code, description)
        SELECT id, 'CS 483 Algorithms', 'CS483', 'Design and analysis of algorithms'
        FROM colleges WHERE id > 1
    """)
    # Enroll users from other colleges in their college's courses
    # Courses 4,5 are VT; 6,7 UCLA; etc. - we need to map college -> course ids
    # Simpler: for colleges 2-7, courses get ids 4,5 (VT), 6,7 (UCLA), etc.
    # Actually the INSERT SELECT creates one row per college. So college 2 gets course 4, college 3 gets 5, etc.
    # Enroll VT users (college_id=2) in courses 4,5
    op.execute("""
        INSERT INTO enrollments (user_id, course_id)
        SELECT u.id, c.id FROM users u
        JOIN courses c ON c.college_id = u.college_id
        WHERE u.college_id = 2
    """)
    for cid in range(3, 8):
        op.execute(f"""
            INSERT INTO enrollments (user_id, course_id)
            SELECT u.id, c.id FROM users u
            JOIN courses c ON c.college_id = u.college_id
            WHERE u.college_id = {cid}
        """)


def downgrade() -> None:
    op.execute("DELETE FROM enrollments")
    op.execute("DELETE FROM courses")
