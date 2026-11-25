
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_current_user, get_session
from app.models.user import UserModel
from app.schemas.user import UserResponse, UserUpdate
from app.core.storage import upload_file
import uuid


router = APIRouter(prefix="/api/users", tags=["users"])


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
):
    changes = data.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update.")

    new_username = changes.get("username")

    if new_username and new_username != current_user.username:
        taken = await session.scalar(
            select(UserModel).where(UserModel.username == new_username)
        )

        if taken:
            raise HTTPException(status_code=409, detail="Username already taken.")

    for field, value in changes.items():
        setattr(current_user, field, value)

    await session.commit()
    await session.refresh(current_user)

    return current_user


ALLOWED_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}

MAX_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG and WebP images are allowed."
        )

    data = await file.read()

    if len(data) > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be 5 MB or smaller."
        )

    extension = ALLOWED_TYPES[file.content_type]
    key = f"users/{current_user.id}/{uuid.uuid4()}.{extension}"

    url = upload_file(data, key, file.content_type)

    current_user.avatar_url = url

    await session.commit()
    await session.refresh(current_user)

    return current_user
