from fastapi import APIRouter, Response, UploadFile, File, Request, Depends
from database.models import  EmailRequest, OTPVerification, UserRegistration, PasswordReset, LoginRequest
from utils.jwt import get_current_user
from services.auth_service import logout_service, send_otp_service, verify_otp_service, register_user_service, reset_password_service, login_service, get_user_details_service
import base64
from database.connection import users_collection
from services.auth_service import get_current_user_service



router = APIRouter()

@router.post("/send-otp")
async def send_otp(request: EmailRequest):
    return send_otp_service(request)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerification):
    return verify_otp_service(request)

@router.post("/register")
async def register_user(user: UserRegistration):
    return register_user_service(user)

@router.post("/reset-password")
async def reset_password(request: PasswordReset):
    return reset_password_service(request)

@router.post("/login")
async def login(request: LoginRequest, response: Response):
    return login_service(request, response)



@router.get("/me")
async def get_current_user_new(request: Request):
    return get_current_user_service(request)

@router.get("/getuserdetails")
async def get_user_details(current_user: dict = Depends(get_current_user)):
    return get_user_details_service(current_user)

@router.post("/logout")
async def logout_user(response: Response):
    return logout_service(response)

