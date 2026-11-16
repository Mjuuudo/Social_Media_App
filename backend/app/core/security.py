from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


hasher = PasswordHasher()


def hashPassword( password: str ) -> str :
    return  hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        hasher.verify(password_hash, password)
        return True
    except VerifyMismatchError:
        return False
    return True
    