from app.models.base import Base
from datetime import datetime
from sqlalchemy import DateTime, String, Text,  func,ForeignKey,Integer
from sqlalchemy.orm import Mapped, mapped_column,relationship



        
class PostsModel(Base):
    __tablename__="posts"
    id:Mapped[int]=mapped_column(primary_key=True)
    user_id:Mapped[int]=mapped_column(  ForeignKey("users.id"),nullable=False)
    caption:Mapped[str|None]=mapped_column(Text,nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())
    updated_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())
    media= relationship("PostsMedia",back_populates="post",cascade="all,delete-orphan")
    user=relationship("UserModel",back_populates="post")

class PostMedia(Base):
    __tablename__="post_media"
    id:Mapped[int]=mapped_column(primary_key=True)
    post_id:Mapped[int]=mapped_column(ForeignKey("posts.id",ondelete="CASCADE"),nullable=False)
    file_key:Mapped[str]=mapped_column(String(100),nullable=False)
    media_type:Mapped[str]=mapped_column(String(100),nullable=False)
    position:Mapped[int]=mapped_column(Integer,default=0)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())
    post=relationship("PostsModel",back_populates="media")
