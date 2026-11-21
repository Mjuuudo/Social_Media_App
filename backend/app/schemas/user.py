from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
import uuid


class RegisterRequest ( BaseModel ):
    username: str = Field( min_length = 2, max_length=40, pattern=r"^[A-Za-z0-9._-]+$" )
    email: EmailStr = Field( max_length=255 )
    first_name: str = Field( min_length = 2, max_length=26 )
    last_name: str = Field( min_length = 2, max_length=26 )
    password: str = Field( min_length = 8, max_length=128 )


    @field_validator("email", "username", mode="before")
    @classmethod
    def clean_fields ( cls, value: str ) -> str :
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def clean_name( cls, value: str ) -> str :
       if isinstance(value, str) :
            return value.strip()
       return value

class RegisterResponse ( BaseModel ):
    model_config = ConfigDict( from_attributes = True )

    id: uuid.UUID
    username: str
    email: EmailStr
    is_private: bool

class loginModel ( BaseModel ) :
    identifier: str
    password: str

    @field_validator("identifier", "password")
    @classmethod
    def triming_spaces ( cls, value : str ) -> str :
        return value.strip()


class loginResponse ( BaseModel ) :
    model_config = ConfigDict( from_attributes = True)

    id: uuid.UUID
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    bio: str | None
    location: str | None
    created_at: datetime



class loggedInUser ( BaseModel ) :
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





    