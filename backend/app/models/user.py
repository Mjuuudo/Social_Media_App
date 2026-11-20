from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, func, DateTime
from datetime import datetime
from app.models.base import Base

from datetime import datetime

from sqlalchemy import DateTime, String, Text, false, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserModel(Base):
    __tablename__ = "users"

    # ── Identity ─────────────────────────────────────────────
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(40), unique=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    # ── Profile (shown on the profile page) ─────────────────
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    bio: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    cover_url: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(100))
    headline: Mapped[str | None] = mapped_column(String(100))

    # ── Settings ─────────────────────────────────────────────
    is_private: Mapped[bool] = mapped_column(server_default=false())

    # ── Timestamps ───────────────────────────────────────────
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
        
        
