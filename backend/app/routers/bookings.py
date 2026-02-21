from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import User, ServiceProvider, Booking, UserRole, BookingStatus
from app.schemas import BookingCreate, BookingRead
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=BookingRead)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    provider = session.get(ServiceProvider, booking_data.provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    new_booking = Booking(
        user_id=current_user.id,
        provider_id=booking_data.provider_id,
        date_time=booking_data.date_time
    )
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    return new_booking

@router.get("/my-bookings", response_model=List[BookingRead])
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role == UserRole.PROVIDER:
        provider = session.exec(select(ServiceProvider).where(ServiceProvider.user_id == current_user.id)).first()
        if not provider:
            return []
        statement = select(Booking).where(Booking.provider_id == provider.id)
    else:
        statement = select(Booking).where(Booking.user_id == current_user.id)

    results = session.exec(statement).all()
    return results

@router.patch("/{booking_id}/status", response_model=BookingRead)
def update_booking_status(
    booking_id: int,
    status: BookingStatus,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Check permissions
    # Provider can complete/cancel
    # Customer can cancel
    provider = session.get(ServiceProvider, booking.provider_id)

    if current_user.role == UserRole.PROVIDER:
        if provider.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
    elif current_user.role == UserRole.CUSTOMER:
        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if status == BookingStatus.COMPLETED:
             raise HTTPException(status_code=403, detail="Only provider can mark as completed")

    booking.status = status
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking
