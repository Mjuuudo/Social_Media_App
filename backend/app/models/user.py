import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, false, func, ForeignKey, true
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserModel(Base):
    """
    ORM model for the `users` table.

    Holds the account identity (username, email, password hash), the public
    profile fields, privacy settings, and timestamps.
    """

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


class RefreshTokenModel ( Base ) :
    """
    ORM model for the `refresh_tokens` table.

    Each row is one refresh token issued to a user. Only the SHA-256 hash of
    the token is stored. A token is valid while `revoked_at` is NULL and
    `expires_at` is in the future. Rows are deleted automatically when the
    owning user is deleted (ON DELETE CASCADE).
    """

    __tablename__ = "refresh_tokens"

    id:Mapped[uuid.UUID] = mapped_column(primary_key=True, server_default=func.gen_random_uuid())
    user_id:Mapped[uuid.UUID] = mapped_column(ForeignKey(
        "users.id", ondelete="CASCADE"
    ), index= True)
    token_hash:Mapped[str] = mapped_column(String(255), unique= True)
    expires_at:Mapped[datetime] = mapped_column(DateTime(timezone = True))
    revoked_at:Mapped[datetime | None] = mapped_column(DateTime( timezone = True))
    created_at:Mapped[datetime] = mapped_column(DateTime( timezone = True ), server_default=func.now())


class UserSettings ( Base ) :
    """
    ORM model for the `user_settings` table: one row of notification
    preferences per user.

    `user_id` is both the primary key and a foreign key to `users.id`, so a
    user can have at most one settings row, and it is deleted automatically
    with the user (`ondelete="CASCADE"`). The row is created at registration
    (see `save_user`), and every preference defaults to `true` in the database.
    """

    __tablename__ = "user_settings"

    user_id:Mapped[uuid.UUID] = mapped_column( ForeignKey(
        "users.id", ondelete="CASCADE"
    ), primary_key=True)
    notify_reactions:Mapped[bool] = mapped_column( server_default = true())
    notify_comments:Mapped[bool] = mapped_column( server_default =  true())
    notify_follows:Mapped[bool] = mapped_column( server_default =  true())
    notify_messages:Mapped[bool] = mapped_column( server_default =  true())
    weekly_digest:Mapped[bool] = mapped_column( server_default =  true())
