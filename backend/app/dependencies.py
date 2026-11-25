from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import decode_access_token
from app.repository.user import get_by_id
from app.schemas.user import loggedInUser


async def get_current_user(
    access_token: str | None = Cookie(default=None), session: AsyncSession = Depends(get_session)
) -> loggedInUser:
    """
    FastAPI dependency that returns the currently authenticated user.

    Reads the JWT from the `access_token` cookie, validates it, and loads the
    matching user from the database. Add it to any route that requires login:
    `user = Depends(get_current_user)`.

    Args:
        access_token: The JWT read from the `access_token` cookie (None if missing).
        session: The database session for this request.

    Returns:
        loggedInUser: The user that owns the token (the SQLAlchemy `UserModel`).

    Raises:
        HTTPException 401: If the cookie is missing, the token is invalid or
            expired, or the user id in the token no longer exists.
    """
    if access_token is None:
        raise HTTPException(status_code=401, detail="Token Not Provided")

    user_id = decode_access_token(access_token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid Token")

    user = await get_by_id(session, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Id Provided In The Token Is Invalid")

    return user
