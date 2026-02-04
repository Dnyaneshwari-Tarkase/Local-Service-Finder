from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
from backend.app.models import UserRole, BookingStatus

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CUSTOMER

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class ProviderCreate(BaseModel):
    services: str
    experience: int
    contact_info: str
    location_pincode: str
    profile_picture: Optional[str] = None

class ProviderRead(BaseModel):
    id: int
    user_id: int
    services: str
    experience: int
    verified: bool
    contact_info: str
    location_pincode: str
    rating_avg: float
    user: UserRead

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    provider_id: int
    date_time: datetime

class BookingRead(BaseModel):
    id: int
    user_id: int
    provider_id: int
    status: BookingStatus
    date_time: datetime
    created_at: datetime
    provider: Optional[ProviderRead] = None
    customer: Optional[UserRead] = None

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    booking_id: int
    rating: int
    comment: Optional[str] = None

class ReviewRead(BaseModel):
    id: int
    booking_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
