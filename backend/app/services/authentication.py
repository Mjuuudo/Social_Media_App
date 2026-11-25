from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.core.security import decode_access_token, hashPassword, verify_password, generate_refresh_token, hash_refresh_token, create_access_token
from app.models.user import UserModel, RefreshTokenModel
from app.repository.user import get_by_email, get_by_id, get_by_username, save_user, save_refresh_token, get_refresh_token
from app.schemas.user import RegisterRequest, loginModel, UpdateProfileRequest, loggedInUser
import uuid

async def register_client(data: RegisterRequest, session: AsyncSession):
    """
    Create a new user account.

    Hashes the password with Argon2, makes sure the username and email are
    not already taken, then saves the new user.

    Args:
        data: The validated registration payload.
        session: The database session.

    Returns:
        UserModel: The newly created user.

    Raises:
        HTTPException 409: If the username or the email already exists.
    """
    hashed_password = hashPassword(data.password)

    if await get_by_username(session, data.username):
        raise HTTPException(status_code=409, detail="Username Already Exists")
    if await get_by_email(session, data.email):
        raise HTTPException(status_code=409, detail="Email Already Exists In Our records")

    new_user = UserModel(
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=hashed_password,
    )

    return await save_user(session, new_user)


async def login_with_email(data: loginModel, session: AsyncSession):
    """
    Authenticate a user whose identifier is an email address.

    Args:
        data: The login payload (`identifier` is the email).
        session: The database session.

    Returns:
        UserModel: The authenticated user.

    Raises:
        HTTPException 401: If no user has this email, or the password is wrong.
    """
    user = await get_by_email(session, data.identifier)

    if not user:
        raise HTTPException(status_code=401, detail="User Not Found In Our records")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credentials Are Not Correct")

    return user


async def login_with_username(data: loginModel, session: AsyncSession):
    """
    Authenticate a user whose identifier is a username.

    Args:
        data: The login payload (`identifier` is the username).
        session: The database session.

    Returns:
        UserModel: The authenticated user.

    Raises:
        HTTPException 401: If no user has this username, or the password is wrong.
    """
    user = await get_by_username(session, data.identifier)

    if not user:
        raise HTTPException(status_code=401, detail="User Not Found In Our records")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credentials Are Not Correct")

    return user


async def get_current_user(session: AsyncSession, access_token: str):
    """
    Resolve the user that owns a given access token.

    Note: the routes use the dependency `app.dependencies.get_current_user`
    instead; this service version is currently not used.

    Args:
        session: The database session.
        access_token: The raw JWT access token.

    Returns:
        UserModel: The user whose id is in the token.

    Raises:
        HTTPException 401: If the token is invalid/expired or the user no longer exists.
    """
    user_id = decode_access_token(access_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalide Token Provided")
    user = await get_by_id(session, user_id)

    if not user:
        raise HTTPException(status_code=401, detail="Not Authenticated")
    return user

async def update_user_data ( session: AsyncSession, data: UpdateProfileRequest, user: loggedInUser ) :
    """
    Apply a partial profile update to the current user.

    Only the fields the client actually sent are changed
    (`model_dump(exclude_unset=True)`). The changes are committed and the
    user is refreshed from the database so `updated_at` is up to date.

    Args:
        session: The database session (the same one that loaded `user`).
        data: The validated update payload.
        user: The authenticated user to modify.

    Returns:
        UserModel: The updated user.
    """
    changed_data = data.model_dump(exclude_unset=True)

    print (changed_data)
    for key, value in changed_data.items() :
        setattr(user, key, value)
    print (user)

    await session.commit()
    await session.refresh(user)
    return user

async def handle_refresh_token ( 
        user_id: uuid.UUID,
        session: AsyncSession
         ) -> str:
   """
   Issue a new refresh token for a user.

   Generates a random token, stores only its SHA-256 hash in the database
   with a 7-day expiry, and returns the raw token so it can be put in a cookie.

   Args:
       user_id: The id of the user the token is issued for.
       session: The database session.

   Returns:
       str: The raw refresh token (to send to the client).
   """
   raw_token = generate_refresh_token( )
   token_hash = hash_refresh_token ( raw_token )
   expires_at = datetime.now(timezone.utc) + timedelta(days=7)
   await save_refresh_token( session, user_id, token_hash, expires_at)

   return raw_token


async def handle_expired_refresh_token(
    session: AsyncSession,
    refresh_token: str
) -> tuple[uuid.UUID, str]:
    """
    Validate a refresh token and rotate it (used by `POST /api/auth/refresh`).

    Looks up the token by its hash and checks that it exists, is not revoked,
    and is not expired. If valid, the old token is revoked (so it can only be
    used once) and a brand-new refresh token is issued.

    Args:
        session: The database session.
        refresh_token: The raw refresh token read from the client's cookie.

    Returns:
        tuple[uuid.UUID, str]: The owner's user id and the new raw refresh token.

    Raises:
        HTTPException 401: If the token is unknown, revoked, or expired.
    """
    hashed_refresh_token = hash_refresh_token(refresh_token)
    object_from_db = await get_refresh_token(session, hashed_refresh_token)

    if not object_from_db:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if object_from_db.revoked_at:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if object_from_db.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    object_from_db.revoked_at = datetime.now(timezone.utc)
    await session.commit()

    new_refresh_token = await handle_refresh_token(user_id=object_from_db.user_id, session=session)
    return object_from_db.user_id, new_refresh_token


async def handle_access_token_for_expired_refresh ( session: AsyncSession, refresh_token: str) -> str :
    """
    Create a new access token for the owner of a refresh token.

    Note: currently not used by any route.

    Args:
        session: The database session.
        refresh_token: The refresh token to look up.

    Returns:
        str: A new JWT access token for the token's owner.
    """
    object_from_db = await get_refresh_token( session, refresh_token )
    access_token = create_access_token( object_from_db.user_id )

    return access_token

async def handle_logout_refresh_token ( session: AsyncSession, refresh_token: str ) :
    token = await get_refresh_token( session, hash_refresh_token(refresh_token) )
    token.revoked_at = datetime.now(timezone.utc)

    await session.commit()







