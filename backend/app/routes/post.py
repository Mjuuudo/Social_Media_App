from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_session,get_current_user
from app.models.user import UserModel
from app.models.post import PostMedia,PostsModel
from app.schemas.post import PostCreate, PostResponse

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.post("/", response_model=PostResponse)
async def create_post(
    caption: str | None = Form(default=None),
    files: list[UploadFile] | None = File(default=None),
    session: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user)
):
    if not caption and not files:
        raise HTTPException(
            status_code=400,
            detail="A post must contain text or media"
        )
    new_post=PostsModel(user_id=current_user.id,caption=caption)
    session.add(new_post)
    await session.commit()
    await session.refresh(new_post)