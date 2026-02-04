from fastapi import APIRouter, Depends
from backend.app.auth import get_current_user
from backend.app.models import User
from backend.app.schemas import UserRead

router = APIRouter()

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
