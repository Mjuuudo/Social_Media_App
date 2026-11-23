from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_session
from app.models.user import UserModel as user
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    changes = data.model_dump(exclude_unset=True)  # only the fields the client sent

    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update.")

    new_username = changes.get("username")
    if new_username and new_username != current_user.username:
        taken = await session.scalar(select(User).where(User.username == new_username))
        if taken:
            raise HTTPException(status_code=409, detail="Username already taken.")

    for field, value in changes.items():
        setattr(current_user, field, value)

    await session.commit()
    await session.refresh(current_user)
    return current_user