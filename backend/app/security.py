import jwt
from argon2 import PasswordHasher 
from argon2.exceptions import VerifyMismatchError 
from app.config import settings
from datetime import datetime, timedelta, timezone




_hasher= PasswordHasher()

def hash_password(password:str)->str:
    return _hasher.hash(password)


def verify_password( password:str, password_hash:str )->bool:
    try:
        return _hasher.verify(password_hash,password)
    except VerifyMismatchError:
        return False

def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)
    payload = {
        "sub": str(user_id),   
        "exp": expire,         
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
    return int(payload["sub"])


def verify_access_token( token: str ) -> int :
    user_id = decode_access_token(token)
    if user_id is None:
        raise ValueError("Invalid access token")
    return user_id