# from fastapi import APIRouter, Depends, HTTPException
# from database.models import AttendanceUpload, MarkAttendance
# from utils.jwt import get_current_user
# from services.home_service import (
#     upload_attendance_list_service,
#     get_attendance_list_service,
#     mark_attendance_service,
#     search_student_service,
#     get_events_service
# )

# router = APIRouter()

# @router.post("/upload-attendance")
# async def upload_attendance(
#     data: AttendanceUpload, 
#     current_user: dict = Depends(get_current_user)
# ):
#     return upload_attendance_list_service(data, current_user)

# @router.get("/attendance-list/{event_id}")
# async def get_attendance_list(
#     event_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     return get_attendance_list_service(event_id, current_user)

# @router.post("/mark-attendance")
# async def mark_attendance(
#     data: MarkAttendance,
#     current_user: dict = Depends(get_current_user)
# ):
#     return mark_attendance_service(data, current_user)

# @router.get("/search-student")
# async def search_student(
#     roll_number: str,
#     event_id: str = "default_event",
#     current_user: dict = Depends(get_current_user)
# ):
#     return search_student_service(roll_number, event_id, current_user)

# @router.get("/events")
# async def get_events(
#     current_user: dict = Depends(get_current_user)
# ):
#     return get_events_service(current_user)

from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from database.models import AttendanceRecord, MarkAttendance
from services.home_service import upload_attendance_service, get_attendance_list_service, search_student_service, mark_attendance_service
from services.auth_service import get_current_user_service  # Import the correct function

router = APIRouter()

@router.post("/upload-attendance")
async def upload_attendance(
    request: Request,  # Add Request parameter
    file: UploadFile = File(...),
    
):
    current_user = get_current_user_service(request)  # Use get_current_user_service
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can upload attendance")
    return await upload_attendance_service(file, current_user)

@router.get("/attendance-list")
async def get_attendance_list(
    request: Request,  # Add Request parameter
):
    current_user = get_current_user_service(request)  # Use get_current_user_service
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view attendance list")
    return get_attendance_list_service()

@router.get("/search-student")
async def search_student(
    roll_number: str,
    request: Request,  # Add Request parameter
):
    current_user = get_current_user_service(request)  # Use get_current_user_service
    if current_user.get("role") != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can search students")
    return search_student_service(roll_number)

@router.post("/mark-attendance")
async def mark_attendance(
    request: MarkAttendance,
    http_request: Request,  # Rename to avoid conflict with `request` parameter
):
    current_user = get_current_user_service(http_request)  # Use get_current_user_service
    if current_user.get("role") != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can mark attendance")
    return mark_attendance_service(request, current_user)