from typing import List, Dict
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func, col, desc
from app.database import get_session
from app.models import User, ServiceProvider, Booking, BookingStatus, AdminLog, PayoutRequest, PayoutStatus
from app.schemas import ProviderRead
from app.auth import get_current_admin

router = APIRouter()

@router.get("/unverified-providers", response_model=List[ProviderRead])
def get_unverified_providers(
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    providers = session.exec(select(ServiceProvider).where(ServiceProvider.verified == False)).all()
    return providers

@router.post("/verify-provider/{provider_id}")
def verify_provider(
    provider_id: int,
    approve: bool,
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    provider = session.get(ServiceProvider, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    if approve:
        provider.verified = True
        action = f"Approved provider {provider_id}"
    else:
        # If rejected, we keep verified=False
        action = f"Rejected provider {provider_id}"

    log = AdminLog(action=action, admin_id=admin.id, target_user_id=provider.user_id)
    session.add(provider)
    session.add(log)
    session.commit()
    return {"message": action}

@router.get("/pending-payouts")
def get_pending_payouts(
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    payouts = session.exec(select(PayoutRequest).where(PayoutRequest.status == PayoutStatus.PENDING)).all()
    return payouts

@router.post("/process-payout/{payout_id}")
def process_payout(
    payout_id: int,
    approve: bool,
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    payout = session.get(PayoutRequest, payout_id)
    if not payout:
        raise HTTPException(status_code=404, detail="Payout request not found")

    if payout.status != PayoutStatus.PENDING:
        raise HTTPException(status_code=400, detail="Payout request already processed")

    payout.status = PayoutStatus.APPROVED if approve else PayoutStatus.REJECTED
    payout.updated_at = datetime.now(timezone.utc)

    provider = session.get(ServiceProvider, payout.provider_id)
    if not approve:
        # Refund the wallet if rejected
        provider.wallet_balance += payout.amount
        action = f"Rejected payout request {payout_id} and refunded amount"
    else:
        action = f"Approved payout request {payout_id}"

    log = AdminLog(action=action, admin_id=admin.id, target_user_id=provider.user_id)
    session.add(payout)
    session.add(provider)
    session.add(log)
    session.commit()
    return {"message": action, "status": payout.status}

@router.get("/analytics")
def get_analytics(
    admin: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    # Most booked services
    # Simplified version: count bookings per service string
    top_services = session.exec(
        select(ServiceProvider.services, func.count(Booking.id).label("booking_count"))
        .join(Booking)
        .group_by(ServiceProvider.services)
        .order_by(desc("booking_count"))
        .limit(5)
    ).all()

    # Popular locations
    popular_locations = session.exec(
        select(ServiceProvider.location_pincode, func.count(Booking.id).label("booking_count"))
        .join(Booking)
        .group_by(ServiceProvider.location_pincode)
        .order_by(desc("booking_count"))
        .limit(5)
    ).all()

    return {
        "top_services": [{"services": s, "count": c} for s, c in top_services],
        "popular_locations": [{"pincode": p, "count": c} for p, c in popular_locations]
    }
