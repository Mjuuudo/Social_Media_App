from fastapi import APIRouter, Depends, Response, Cookie, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.core.security import create_access_token, generate_refresh_token
from app.dependencies import get_current_user
from app.repository.user import get_all
from app.schemas.user import (
    RegisterRequest,
    RegisterResponse,
    loggedInUser,
    loginModel,
    loginResponse,
    UpdateProfileRequest,
)
from app.services.authentication import login_with_email, login_with_username, register_client, update_user_data, handle_refresh_token, handle_expired_refresh_token, handle_access_token_for_expired_refresh, handle_logout_refresh_token

router = APIRouter(tags=["Authentication"])


@router.post("/register", status_code=201, response_model=RegisterResponse)
async def register(data: RegisterRequest, session: AsyncSession = Depends(get_session)):
    """
    Register a new user account.

    Returns 201 with the new user's id, username, email and privacy flag.
    Returns 409 if the username or email is already taken, and 422 if the
    body fails validation.
    """
    user = await register_client(data, session)

    return user


@router.post("/login", status_code=200, response_model=loginResponse)
async def login(data: loginModel, response: Response, session: AsyncSession = Depends(get_session)):
    """
    Log a user in with an email or a username plus a password.

    If `identifier` contains "@" it is treated as an email, otherwise as a
    username. On success, sets two HTTP-only cookies:
    - `access_token`: a short-lived JWT (`settings.access_token_minutes`).
    - `refresh_token`: a 7-day token used by `/refresh` to get a new access token.

    Returns the user's profile. Returns 401 if the credentials are wrong.
    """

    user = None
    if "@" in data.identifier:
        user = await login_with_email(data, session)
    else:
        user = await login_with_username(data, session)

    token = create_access_token(user.id)
    refresh_token = await handle_refresh_token( user.id, session )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_minutes * 60,
        path="/api/auth"
    )

    response.set_cookie(
        key= "refresh_token",
        value = refresh_token,
        httponly= True,
        samesite="lax",
        secure= False,
        max_age= 7 * 24 * 60 * 60,
        path="/api/auth"
    )

    return user


@router.patch("/me", status_code=204)
async def modifyAccount ( 
    data: UpdateProfileRequest,
    user: loggedInUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
) :
    """
    Update the logged-in user's profile (partial update).

    Requires a valid `access_token` cookie. Only the fields included in the
    body are changed. Returns 204 (no body) on success.
    """
    return await update_user_data(session, data, user)


@router.post("/refresh", status_code=204)
async def refresh_access(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    access_token: str | None = Cookie( default = None),
    session: AsyncSession = Depends(get_session),
):
    """
    Get a new access token using the refresh-token cookie.

    Validates and rotates the refresh token (the old one is revoked), then
    replaces both cookies: a new `access_token` and a new `refresh_token`.
    Returns 204 (no body) on success, or 401 if the refresh token is
    missing, unknown, revoked or expired.
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id, new_refresh_token = await handle_expired_refresh_token(session, refresh_token)
    access_token = create_access_token(user_id)

    if access_token :
        response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)

    if refresh_token :
        response.delete_cookie(key="refresh_token", httponly=True, samesite="lax", secure=False)


    response.set_cookie(
        key="access_token", value=access_token,
        httponly=True, samesite="lax", secure=False,
        max_age=settings.access_token_minutes * 60,
        path="/api/auth"
    )
    response.set_cookie(
        key="refresh_token", value=new_refresh_token,
        httponly=True, samesite="lax", secure=False,
        max_age=7 * 24 * 60 * 60,
        path="/api/auth",                   
    )



@router.get("/logout", status_code=200)
async def logout(
    response: Response,
    session: AsyncSession = Depends( get_session ),
    refresh_token: str | None = Cookie( default=None )):
    """
    Log the user out by deleting the `access_token` and `refresh_token` cookies.

    Note: the refresh token is only removed from the browser; it is not
    revoked in the database.
    """
    response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False, path="/api/auth")
    if refresh_token :
        await handle_logout_refresh_token(session, refresh_token)
    response.delete_cookie(key="refresh_token", httponly=True, samesite="lax", secure=False, path="/api/auth")

@router.get("/users", status_code=200, response_model=list[loggedInUser])
async def list_all(session: AsyncSession = Depends(get_session)):
    """
    List every registered user.

    Note: this route does not require authentication.
    """
    return await get_all(session)


@router.get("/me", status_code=200, response_model=loggedInUser)
async def list_me(user: loggedInUser = Depends(get_current_user)):
    """
    Return the profile of the currently logged-in user.

    Requires a valid `access_token` cookie, otherwise returns 401.
    """
    return user
