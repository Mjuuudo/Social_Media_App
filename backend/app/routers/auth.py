from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.config import settings
from app.database import get_session
from app.models import User
from app.schemas import LoginRequest, RegisterRequest, UserResponse
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_COOKIE = "access_token"

# Used when the user doesn't exist, so a wrong username takes as long to
# reject as a wrong password (otherwise response time leaks which accounts exist).
_DUMMY_HASH = hash_password("not-a-real-password")


@router.post("/register", status_code=201, response_model=UserResponse)
async def register(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=409,
            detail= "Username or email already in use"
        )
        
    return user


@router.post("/login", response_model=UserResponse)
async def login(
    data: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(User).where(or_(User.username == data.login, User.email == data.login))
    )
    user = result.scalar_one_or_none()

    password_ok = verify_password(data.password, user.password_hash if user else _DUMMY_HASH)
    if user is None or not password_ok:
        # Same message for both cases so attackers can't tell which part was wrong
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    # The token goes in an httpOnly cookie: JavaScript can't read it, so an XSS
    # bug can't steal it. The browser sends it back automatically.
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=create_access_token(user.id),
        httponly=True,
        samesite="lax",
        secure=False,  # set to True in production (HTTPS only)
        max_age=settings.ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    return user
