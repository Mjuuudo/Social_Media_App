from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict

class RegisterRequest ( BaseModel ):
    username: str = Field( min_length = 2, max_length=40 )
    first_name: str = Field( min_length = 2, max_length=26 )
    last_name: str = Field( min_length = 2, max_length=26 )
    email: EmailStr = Field( max_length=255 )
    password: str = Field( min_length = 8, max_length=128 )


class RegisterResponse ( BaseModel ):
    model_config = ConfigDict( from_attributes = True )

    id: int
    username: str
    email: EmailStr

class UserModel ( BaseModel ) :
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    joined_at: datetime
    