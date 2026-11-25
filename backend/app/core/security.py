import uuid
from datetime import datetime, timedelta, timezone

import secrets, jwt, hashlib
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import settings

hasher = PasswordHasher()


def hashPassword(password: str) -> str:
    """
    Hash a plain-text password using Argon2.

    The returned string embeds the salt and Argon2 parameters, so it can be
    stored as-is in the database and later checked with `verify_password`.

    Args:
        password: The plain-text password provided by the user.

    Returns:
        str: The Argon2 hash of the password.
    """
    return hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """
    Check whether a plain-text password matches a stored Argon2 hash.

    Args:
        password: The plain-text password the user is trying to log in with.
        password_hash: The Argon2 hash stored in the database for that user.

    Returns:
        bool: True if the password matches the hash, False otherwise.
    """
    try:
        hasher.verify(password_hash, password)
        return True
    except VerifyMismatchError:
        return False


def create_access_token(user_id: uuid.UUID) -> str:
    """
    Create a signed, short-lived JWT access token for a user.

    The token contains the user's id in the `sub` claim and expires after
    `settings.access_token_minutes` minutes. It is signed with HS256 using
    `settings.jwt_secret`.

    Args:
        user_id: The id of the user the token is issued for.

    Returns:
        str: The encoded JWT string.
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    payload = {"sub": str(user_id), "exp": expire}

    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_access_token(token: str) -> uuid.UUID | None:
    """
    Verify a JWT access token and extract the user id from it.

    The signature and the expiry (`exp`) are both checked by PyJWT.

    Args:
        token: The raw JWT string (usually read from the `access_token` cookie).

    Returns:
        uuid.UUID | None: The user id stored in the `sub` claim, or None if the
        token is invalid, tampered with, or expired.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
    return uuid.UUID(payload["sub"])

def generate_refresh_token ( ) -> str :
    """
    Generate a new random refresh token.

    Uses a cryptographically secure source (32 random bytes, URL-safe base64).
    This raw value is sent to the client in a cookie; only its hash
    (see `hash_refresh_token`) is stored in the database.

    Returns:
        str: The raw, URL-safe refresh token.
    """
    return secrets.token_urlsafe(32)

def hash_refresh_token ( string: str ) -> str :
    """
    Hash a raw refresh token with SHA-256.

    Refresh tokens are stored hashed so that a database leak does not expose
    usable tokens. SHA-256 (instead of Argon2) is enough here because the
    token is already long and random, and the hash must be deterministic
    so it can be looked up in the database.

    Args:
        string: The raw refresh token.

    Returns:
        str: The hex-encoded SHA-256 digest of the token.
    """
    return hashlib.sha256(string.encode()).hexdigest()
