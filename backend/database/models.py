# database/models.py
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import List, Optional

class EmailRequest(BaseModel):
    email: EmailStr
    requestType: str

    @field_validator('email')
    def validate_email_domain(cls, v):
        if not v.endswith('@iitk.ac.in'):
            raise ValueError('Only @iitk.ac.in email addresses are allowed')
        return v

    @field_validator('requestType')
    def validate_request_type(cls, v):
        if v not in ['signup', 'forgot']:
            raise ValueError('Request type must be either "signup" or "forgot"')
        return v

class OTPVerification(BaseModel):
    email: EmailStr
    otp: str
    requestType: str

class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    name: str
    roll_number: str

class PasswordReset(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Updated attendance models
class AttendanceRecord(BaseModel):
    name: str
    roll_number: str
    event_id: str = Field(default="default_event")
    is_present: bool = Field(default=False)
    marked_by: Optional[str] = None
    marked_at: Optional[str] = None

class AttendanceUpload(BaseModel):
    students: List[AttendanceRecord]

class MarkAttendance(BaseModel):
    roll_number: str
    event_id: str = Field(default="default_event")

# New UserProfile model
class UserProfile(BaseModel):
    name: str
    roll_number: str
    role: str
    _id: str

    model_config = ConfigDict(from_attributes=True)  # Allow conversion from MongoDB documents