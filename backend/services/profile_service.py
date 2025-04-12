# services/profile_service.py
from fastapi import HTTPException, Depends
from services.auth_service import get_current_user_service  # Corrected import
from database.models import UserProfile

async def get_profile_service(current_user: dict = Depends(get_current_user_service)):
    """
    Fetch the current user's profile data.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Map the user data to the UserProfile model
        profile_data = UserProfile(
            name=current_user.get("name", "Unknown"),
            roll_number=current_user.get("roll_number", "N/A"),
            role=current_user.get("role", "Unknown"),
            _id=str(current_user.get("_id", ""))
        )
        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")