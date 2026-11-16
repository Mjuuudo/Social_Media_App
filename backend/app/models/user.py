from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, func, DateTime
from datetime import datetime
from app.models.base import Base

class UserModel ( Base ) :
        __tablename__ = "users"

        id:Mapped[int] = mapped_column(primary_key=True)
        username:Mapped[str] = mapped_column(String(40), unique=True)
        first_name:Mapped[str]
        last_name:Mapped[str]
        email:Mapped[str] = mapped_column(String(255), unique=True)
        password_hash:Mapped[str] 
        joined_at:Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default= func.now())
