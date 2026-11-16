from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from datetime import datetime, timedelta, timezone
import jwt
from app.core.config import settings


hasher = PasswordHasher()


def hashPassword( password: str ) -> str :
    return  hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        hasher.verify(password, password_hash)
        return True
    except VerifyMismatchError:
        return False
    return True



def create_access_token ( user_id : int ) -> str :
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
    