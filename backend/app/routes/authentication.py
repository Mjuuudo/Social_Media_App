from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.core.security import create_access_token
from app.dependencies import get_current_user
from app.repository.user import get_all
from app.schemas.user import (
    RegisterRequest,
    RegisterResponse,
    loggedInUser,
    loginModel,
    loginResponse,
)
from app.services.authentication import login_with_email, login_with_username, register_client

router = APIRouter(tags=["Authentication"])


@router.post("/register", status_code=201, response_model=RegisterResponse)
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_session)):
    user = await register_client(data, session)

    return user


@router.post("/login", status_code=200, response_model=loginResponse)
async def login(data: loginModel, response: Response, session: AsyncSession = Depends(get_session)):

    user = None
    if "@" in data.identifier:
        user = await login_with_email(data, session)
    else:
        user = await login_with_username(data, session)

    token = create_access_token(user.id)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_minutes * 60,
    )
    return user


@router.get("/logout", status_code=200)
async def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)


@router.get("/users", status_code=200, response_model=list[loggedInUser])
async def list_all(session: AsyncSession = Depends(get_session)):
    return await get_all(session)


@router.get("/me", status_code=200, response_model=loggedInUser)
async def list_me(user: loggedInUser = Depends(get_current_user)):
    return user
