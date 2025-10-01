from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    is_professional: bool = False
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class SensorDataBase(BaseModel):
    sensor_id: str
    temperature: float
    ph_level: float
    turbidity: float
    dissolved_oxygen: float

class SensorDataCreate(SensorDataBase):
    pass

class SensorData(SensorDataBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class HazardLogBase(BaseModel):
    severity: str
    description: str
    sensor_data_id: int

class HazardLogCreate(HazardLogBase):
    pass

class HazardLog(HazardLogBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None