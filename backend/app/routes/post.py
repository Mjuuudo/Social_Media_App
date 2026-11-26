import uuid
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies import get_session,get_current_user
from app.models.user import UserModel
from app.models.post import PostMedia,PostsModel
from app.schemas.post import PostCreate, PostResponse
from app.core.storage import upload_file

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)
ALLOWED_TYPES = {
    "image/jpeg": ("image", "jpg"),
    "image/png": ("image", "png"),
    "image/webp": ("image", "webp"),
    "video/mp4": ("video", "mp4"),
    "video/webm": ("video", "webm"),
}

MAX_SIZES = {
    "image": 5 * 1024 * 1024,
    "video": 50 * 1024 * 1024,
}

@router.post("/", response_model=PostResponse)
async def create_post(
    caption: str | None = Form(default=None),
    file: UploadFile |None = File(default=None),
    session: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user)
):
    if not caption and not file:
        raise HTTPException(
            status_code=400,
            detail="A post must contain text or media"
        )
    validated=[]
    if file:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type:{file.content_type}"
            )
        media_type,extension=ALLOWED_TYPES[file.content_type]
        data = await file.read()
        if len(data)>MAX_SIZES[media_type]:
            raise HTTPException(
                status_code=413,
                detail=f"{file.filename} is too large for a {media_type}."
            )
        validated.append((data,file.content_type,media_type,extension))
    new_post=PostsModel(user_id=current_user.id,caption=caption)
    session.add(new_post)
    await session.flush() #to sends the insert ...create post to posatresql so it gives new post a id
    if file: 
        key=f"posts/{new_post.id}/{uuid.uuid4()}.{extension}"
        upload_file(data,key,file.content_type)
        session.add(
            PostMedia(
                post_id=new_post.id,
                file_key=key,
                media_type=media_type,
                position=0,
            )
        )
        
    await session.commit()
    # await session.refresh(new_post)
    result= await session.execute(
        select(PostsModel).where(PostsModel.id== new_post.id).options(selectinload(PostsModel.media))
    )
    return result.scalar_one()