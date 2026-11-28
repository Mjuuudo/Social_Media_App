import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    """
    Request body for `POST /api/auth/register`.

    Validates the new account's fields. Username may only contain letters,
    digits, `.`, `_` and `-`. Password must be 8 to 128 characters.
    """

    username: str = Field(min_length=2, max_length=40, pattern=r"^[A-Za-z0-9._-]+$")
    email: EmailStr = Field(max_length=255)
    first_name: str = Field(min_length=2, max_length=26)
    last_name: str = Field(min_length=2, max_length=26)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email", "username", mode="before")
    @classmethod
    def clean_fields(cls, value: str) -> str:
        """
        Normalize `email` and `username` before validation.

        Strips surrounding whitespace and lowercases the value, so that
        "  John@Mail.com " and "john@mail.com" are treated as the same account.
        Non-string values are passed through unchanged so Pydantic can reject them.
        """
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def clean_name(cls, value: str) -> str:
        """
        Strip surrounding whitespace from `first_name` and `last_name`.

        Runs before the length checks, so "  Al  " counts as 2 characters.
        Case is preserved (unlike `clean_fields`).
        """
        if isinstance(value, str):
            return value.strip()
        return value


class RegisterResponse(BaseModel):
    """
    Response body returned after a successful registration.

    Built directly from the `UserModel` (`from_attributes=True`) and exposes
    only safe fields: no password hash.
    """

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str
    email: EmailStr
    is_private: bool


class loginModel(BaseModel):
    """
    Request body for `POST /api/auth/login`.

    `identifier` can be either an email or a username: the route treats it
    as an email if it contains "@".
    """

    identifier: str
    password: str

    @field_validator("identifier", "password")
    @classmethod
    def triming_spaces(cls, value: str) -> str:
        """
        Strip surrounding whitespace from `identifier` and `password`.

        Note: unlike registration, the identifier is not lowercased here.
        """
        return value.strip()


class loginResponse(BaseModel):
    """
    Response body returned after a successful login.

    Contains the user's public profile data (no password hash).
    The tokens themselves are sent as HTTP-only cookies, not in this body.
    """

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    bio: str | None
    location: str | None
    created_at: datetime

# The Update Schema For The User Modification Request

class UpdateProfileRequest ( BaseModel ) :
    """
    Request body for `PATCH /api/auth/me` (partial profile update).

    Every field is optional: only the fields actually sent by the client
    are applied (see `update_user_data`, which uses `exclude_unset=True`).
    """

    first_name: str | None = Field( default = None, min_length= 3,max_length=30)
    last_name: str | None = Field( default = None, min_length=3, max_length= 30)
    bio: str | None = Field ( default = None, max_length = 300)
    location: str | None = Field ( default = None, max_length = 100)
    job_title: str | None = Field ( default = None, max_length=50 )
    is_private: bool | None = None

    @field_validator("first_name", "last_name", "bio", "location", "job_title", mode="before")
    @classmethod
    def strip_text ( cls, value: str ) -> str :
        """
        Strip surrounding whitespace from the text fields before validation.

        Applies to first_name, last_name, bio, location and job_title.
        Non-string values (like None) are passed through unchanged.
        """
        if isinstance( value, str) :
            return value.strip()
        return value

    @field_validator("first_name", "last_name", "is_private")
    @classmethod
    def not_null ( cls, value: str ) -> str :
        """
        Reject an explicit `null` for first_name, last_name and is_private.

        These columns are NOT NULL in the database. Omitting the field is
        fine (it is simply not updated), but sending `null` raises an error.

        Raises:
            ValueError: If the client sent `null` for one of these fields.
        """
        if  value is None :
            raise ValueError("Cannot Be Null")
        return value
        


    



# Returned User Object

class loggedInUser(BaseModel):
    """
    Full user profile returned to the client (e.g. by `GET /api/auth/me`).

    Includes every user field except the password hash.
    """

    id: uuid.UUID
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    bio: str | None
    location: str | None
    job_title: str | None
    avatar_key: str | None
    cover_key: str | None
    is_private: bool
    created_at: datetime
    updated_at: datetime
    last_seen_at: datetime | None

class UserSettings ( BaseModel ) :
    """
    Notification preferences returned by `GET /api/auth/settings`.

    Mirrors the `user_settings` table. Each flag turns one kind of
    notification on (`True`) or off (`False`).
    """

    user_id: uuid.UUID
    notify_reactions: bool
    notify_comments: bool
    notify_follows: bool
    notify_messages: bool
    weekly_digest: bool


class UserUpdateSettings ( BaseModel ) :
    """
    Request body for `PATCH /api/auth/settings` (partial settings update).

    Every field is optional: only the flags actually sent by the client are
    applied (see `handle_update_user_settings`, which uses `exclude_unset=True`).
    The `= None` defaults are what make the fields optional; without them
    Pydantic would require every flag in every request.
    """

    notify_reactions: bool | None = None
    notify_comments: bool | None = None
    notify_follows: bool | None = None
    notify_messages: bool | None = None
    weekly_digest: bool | None = None
