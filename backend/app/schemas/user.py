from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator

class RegisterRequest ( BaseModel ):
    username: str = Field( min_length = 2, max_length=40 )
    first_name: str = Field( min_length = 2, max_length=26 )
    last_name: str = Field( min_length = 2, max_length=26 )
    email: EmailStr = Field( max_length=255 )
    password: str = Field( min_length = 8, max_length=128, pattern=r"^[a-zA-Z0-9._/@]$" )
    
    
    @field_validator("username", "first_name", "last_name", mode="before")
    @classmethod
    def strip_spaces(cls,value:str)->str:
        if isinstance(value,str):
            return value.strip()
        return value


class RegisterResponse ( BaseModel ):
    model_config = ConfigDict( from_attributes = True )

    id: int
    username: str
    email: EmailStr

class UserResponse ( BaseModel ) :
    model_config = ConfigDict( from_attributes = True)

    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    joined_at: datetime
    bio:str|None = Field(default=None ,max_length=500)
    avatar_url:str|None = Field(default=None,min_length=10,max_length=500)
    cover_url: str |None = Field(default=None,min_length=10,max_length=500)
    location: str |None = Field(default=None,max_length=500)
    headline:str|None = Field(default=None,min_length=10,max_length=500)



class UserModel ( BaseModel ) :
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    joined_at: datetime
    bio:str|None = Field(default=None ,max_length=500)
    avatar_url:str|None = Field(default=None,min_length=10,max_length=500)
    cover_url: str |None = Field(default=None,min_length=10,max_length=500)
    location: str |None = Field(default=None,max_length=500)
    headline:str|None = Field(default=None,min_length=10,max_length=500)

class loginModel ( BaseModel ) :
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    username: str | None = Field(default=None, max_length=100)
    headline: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    location: str | None = Field(default=None, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=500)
    cover_url: str | None = Field(default=None, max_length=500)
    
    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def strip_spaces ( cls, value: str ) -> str :
        if isinstance(value, str) :
            return value.strip()
        return value
