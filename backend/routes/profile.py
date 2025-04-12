# routers/profile.py
from fastapi import APIRouter, Depends, Request
from services.profile_service import get_profile_service
from database.models import UserProfile

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_profile(request: Request, current_user: dict = Depends(get_profile_service)):
    """
    Retrieve the current user's profile information.
    """
    return current_user