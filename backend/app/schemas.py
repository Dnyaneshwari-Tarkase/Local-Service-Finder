from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models import UserRole, BookingStatus, PayoutStatus

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
    kyc_document: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ProviderRead(BaseModel):
    id: int
    user_id: int
    services: str
    experience: int
    verified: bool
    is_online: bool
    wallet_balance: float
    commission_rate: float
    contact_info: str
    kyc_document: Optional[str] = None
    location_pincode: str
    rating_avg: float
    user: UserRead

    class Config:
        from_attributes = True

class PayoutRequestRead(BaseModel):
    id: int
    provider_id: int
    amount: float
    status: PayoutStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    provider_id: int
    date_time: datetime
    total_price: float = 0.0

class BookingRead(BaseModel):
    id: int
    user_id: int
    provider_id: int
    status: BookingStatus
    total_price: float
    start_otp: Optional[str] = None
    end_otp: Optional[str] = None
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
