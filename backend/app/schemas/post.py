from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator



class PostCreate(BaseModel):
  
    caption:str|None=Field(default=None,max_length=500)
    

class PostUpdate(BaseModel):
   
    caption:str|None=Field(default=None,max_length=500)


class PostMediaResponse(BaseModel):
    id:int
    file_key:str
    media_type:str
    position:int
    model_config=ConfigDict(from_attributes=True)
   

class PostResponse(BaseModel):
    id:int
    user_id:int
    caption:str|None=Field(default=None,max_length=500)
    created_at: datetime
    updated_at:datetime
    media:list[PostMediaResponse]=Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)
    

     