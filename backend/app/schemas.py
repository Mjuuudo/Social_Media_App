from pydantic import BaseModel,Field,ConfigDict,field_validator

class RegisterRequest(BaseModel):
    username:str = Field(min_length=5 , max_length=30)
    email:str 
    password:str=Field(min_length=8)
    
class UserResponse(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    username:str
    email:str