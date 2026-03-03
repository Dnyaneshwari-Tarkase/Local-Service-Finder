from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class UserRole(str, Enum):
    CUSTOMER = "customer"
    PROVIDER = "provider"
    ADMIN = "admin"

class BookingStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PayoutStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: UserRole = Field(default=UserRole.CUSTOMER)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    provider_profile: Optional["ServiceProvider"] = Relationship(back_populates="user")
    bookings: List["Booking"] = Relationship(back_populates="customer")

class ServiceProvider(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    services: str  # Comma-separated or JSON string for categories
    experience: int # Years
    verified: bool = Field(default=False)
    is_online: bool = Field(default=False)
    wallet_balance: float = Field(default=0.0)
    commission_rate: float = Field(default=0.15) # 15% platform fee
    contact_info: str
    profile_picture: Optional[str] = None
    kyc_document: Optional[str] = None # URL to uploaded ID proof
    location_pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating_avg: float = Field(default=0.0)

    # Relationships
    user: User = Relationship(back_populates="provider_profile")
    bookings: List["Booking"] = Relationship(back_populates="provider")
    payout_requests: List["PayoutRequest"] = Relationship(back_populates="provider")

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    provider_id: int = Field(foreign_key="serviceprovider.id")
    status: BookingStatus = Field(default=BookingStatus.PENDING)
    total_price: float = Field(default=0.0)
    start_otp: Optional[str] = None
    end_otp: Optional[str] = None
    date_time: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    customer: User = Relationship(back_populates="bookings")
    provider: ServiceProvider = Relationship(back_populates="bookings")
    review: Optional["Review"] = Relationship(back_populates="booking")

class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    booking_id: int = Field(foreign_key="booking.id", unique=True)
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    booking: Booking = Relationship(back_populates="review")

class PayoutRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    provider_id: int = Field(foreign_key="serviceprovider.id")
    amount: float
    status: PayoutStatus = Field(default=PayoutStatus.PENDING)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

    # Relationships
    provider: ServiceProvider = Relationship(back_populates="payout_requests")

class AdminLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    action: str
    target_user_id: Optional[int] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    admin_id: int = Field(foreign_key="user.id")
