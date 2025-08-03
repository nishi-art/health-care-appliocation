from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email:EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime


class MemoBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    year: int
    month: int
    day: int
    meal: str = ""
    exercise: str = ""
    hospital: str = ""
    other: str = ""
    weight: str = ""

class MemoCreate(MemoBase):
    pass

class MemoResponse(MemoBase):
    id: int


class HospitalMemoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    day: int
    hospital: str = ""

class WeightMemoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    day: int
    weight: str = ""


class QuestionToAiResponse(BaseModel):
    ai_answer: str = ""