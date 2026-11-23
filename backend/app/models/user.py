import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, false, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserModel(Base):
    __tablename__ = "users"

    # ── Identity ─────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=func.gen_random_uuid())
    username: Mapped[str] = mapped_column(String(40), unique=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    # ── Profile (shown on the profile page) ─────────────────
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    bio: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(String(100))
    job_title: Mapped[str | None] = mapped_column(String(50))

    avatar_key: Mapped[str | None] = mapped_column(String(500))
    cover_key: Mapped[str | None] = mapped_column(String(500))

    # ── Settings ─────────────────────────────────────────────
    is_private: Mapped[bool] = mapped_column(server_default=false())

    # ── Timestamps ───────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
