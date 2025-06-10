from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email:EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserCreate):
    id: int
    created_at: datetime