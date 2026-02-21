from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import User, Booking, Review, BookingStatus, ServiceProvider
from app.schemas import ReviewCreate, ReviewRead
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ReviewRead)
def post_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    booking = session.get(Booking, review_data.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the customer who booked can leave a review")

    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Reviews can only be left for completed bookings")

    # Check if already reviewed
    existing = session.exec(select(Review).where(Review.booking_id == booking.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already exists for this booking")

    new_review = Review(
        booking_id=booking.id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    session.add(new_review)

    # Update provider's average rating
    provider = session.get(ServiceProvider, booking.provider_id)
    all_reviews = session.exec(select(Review).join(Booking).where(Booking.provider_id == provider.id)).all()

    total_rating = sum([r.rating for r in all_reviews]) + review_data.rating
    provider.rating_avg = total_rating / (len(all_reviews) + 1)
    session.add(provider)

    session.commit()
    session.refresh(new_review)
    return new_review

@router.get("/provider/{provider_id}", response_model=List[ReviewRead])
def get_provider_reviews(provider_id: int, session: Session = Depends(get_session)):
    statement = select(Review).join(Booking).where(Booking.provider_id == provider_id)
    results = session.exec(statement).all()
    return results
