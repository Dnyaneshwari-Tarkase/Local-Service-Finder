from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col, or_, desc
from app.database import get_session
from app.models import User, ServiceProvider, UserRole, PayoutRequest, PayoutStatus
from app.schemas import ProviderCreate, ProviderRead
from app.auth import get_current_user
from datetime import datetime, timezone

router = APIRouter()

@router.post("/register", response_model=ProviderRead)
def register_provider(
    provider_data: ProviderCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only users with PROVIDER role can register as service provider")

    # Check if already registered
    existing = session.exec(select(ServiceProvider).where(ServiceProvider.user_id == current_user.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Provider profile already exists")

    new_provider = ServiceProvider(
        user_id=current_user.id,
        services=provider_data.services,
        experience=provider_data.experience,
        contact_info=provider_data.contact_info,
        location_pincode=provider_data.location_pincode,
        profile_picture=provider_data.profile_picture
    )
    session.add(new_provider)
    session.commit()
    session.refresh(new_provider)
    return new_provider

@router.get("/", response_model=List[ProviderRead])
def get_providers(
    category: Optional[str] = None,
    pincode: Optional[str] = None,
    verified_only: bool = True,
    online_only: bool = True,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: float = 10.0,
    sort_by: Optional[str] = "rating", # rating, experience
    session: Session = Depends(get_session)
):
    statement = select(ServiceProvider)
    if verified_only:
        statement = statement.where(ServiceProvider.verified == True)
    if online_only:
        statement = statement.where(ServiceProvider.is_online == True)
    if pincode:
        statement = statement.where(ServiceProvider.location_pincode == pincode)
    if category:
        statement = statement.where(col(ServiceProvider.services).ilike(f"%{category}%"))

    if sort_by == "rating":
        statement = statement.order_by(desc(ServiceProvider.rating_avg))
    elif sort_by == "experience":
        statement = statement.order_by(desc(ServiceProvider.experience))

    results = session.exec(statement).all()
    return results

@router.get("/{provider_id}", response_model=ProviderRead)
def get_provider_detail(provider_id: int, session: Session = Depends(get_session)):
    provider = session.get(ServiceProvider, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

@router.patch("/me/status")
def toggle_online_status(
    is_online: bool,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can toggle online status")

    provider = session.exec(select(ServiceProvider).where(ServiceProvider.user_id == current_user.id)).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    provider.is_online = is_online
    session.add(provider)
    session.commit()
    session.refresh(provider)
    return {"message": f"Provider is now {'online' if is_online else 'offline'}", "is_online": provider.is_online}

@router.post("/me/request-payout")
def request_payout(
    amount: float,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can request payouts")

    provider = session.exec(select(ServiceProvider).where(ServiceProvider.user_id == current_user.id)).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    if amount > provider.wallet_balance:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    payout = PayoutRequest(
        provider_id=provider.id,
        amount=amount,
        status=PayoutStatus.PENDING
    )

    # Deduct from wallet immediately to prevent double-dipping
    provider.wallet_balance -= amount

    session.add(payout)
    session.add(provider)
    session.commit()
    return {"message": "Payout request submitted successfully", "amount": amount, "remaining_balance": provider.wallet_balance}
