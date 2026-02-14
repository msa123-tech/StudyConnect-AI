"""Create colleges and users tables.

Revision ID: 001
Revises:
Create Date: 2026-02-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Colleges
    op.create_table(
        "colleges",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("short_name", sa.String(50), nullable=False),
        sa.Column("domain", sa.String(255), nullable=False),
        sa.Column("logo_url", sa.String(500), nullable=True),
        sa.Column("sso_enabled", sa.Boolean(), default=False),
        sa.Column("status", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_colleges_domain", "colleges", ["domain"], unique=True)

    # Users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("college_id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("student", "admin", name="userrole"), default="student"),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(["college_id"], ["colleges.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", "college_id", name="uq_email_college"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_college_id", "users", ["college_id"])


def downgrade() -> None:
    op.drop_table("users")
    op.drop_table("colleges")
