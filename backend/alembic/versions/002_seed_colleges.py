"""Seed colleges.

Revision ID: 002
Revises: 001
Create Date: 2026-02-14

"""
from typing import Sequence, Union

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        INSERT INTO colleges (name, short_name, domain, sso_enabled, status)
        VALUES
            ('George Mason University', 'GMU', 'gmu.edu', 0, 1),
            ('Virginia Tech', 'VT', 'vt.edu', 0, 1),
            ('UCLA', 'UCLA', 'ucla.edu', 0, 1),
            ('NYU', 'NYU', 'nyu.edu', 0, 1),
            ('Harvard University', 'Harvard', 'harvard.edu', 0, 1),
            ('Stanford University', 'Stanford', 'stanford.edu', 0, 1),
            ('University of Texas', 'UT', 'utexas.edu', 0, 1)
    """)


def downgrade() -> None:
    op.execute("DELETE FROM colleges")
