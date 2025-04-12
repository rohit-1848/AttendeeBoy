# from fastapi import HTTPException
# from database.connection import attendance_collection, users_collection
# from database.models import AttendanceRecord, AttendanceUpload, MarkAttendance
# from datetime import datetime
# from bson import ObjectId

# def upload_attendance_list_service(data: AttendanceUpload, current_user: dict):
#     if attendance_collection is None or users_collection is None:
#         raise HTTPException(status_code=503, detail="Service unavailable")
    
#     if current_user.get("role") != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can upload attendance list")
    
#     # First, clean up any existing records for this event
#     attendance_collection.delete_many({"event_id": data.event_id})
    
#     # Create attendance records
#     attendance_records = []
#     for student in data.students:
#         record = {
#             "name": student["name"],
#             "roll_number": student["roll_number"],
#             "event_id": data.event_id,
#             "is_present": False,
#             "marked_by": None,
#             "marked_at": None
#         }
#         attendance_records.append(record)
    
#     if attendance_records:
#         attendance_collection.insert_many(attendance_records)
    
#     return {"success": True, "message": f"Uploaded {len(attendance_records)} student records"}

# def get_attendance_list_service(event_id: str, current_user: dict):
#     if attendance_collection is None:
#         raise HTTPException(status_code=503, detail="Service unavailable")
    
#     # Get all attendance records for the given event
#     records = list(attendance_collection.find({"event_id": event_id}))
    
#     # Convert ObjectId to string
#     for record in records:
#         record["_id"] = str(record["_id"])
    
#     return {"success": True, "data": records}

# def mark_attendance_service(data: MarkAttendance, current_user: dict):
#     if attendance_collection is None or users_collection is None:
#         raise HTTPException(status_code=503, detail="Service unavailable")
    
#     # Get the student record
#     student = attendance_collection.find_one({
#         "roll_number": data.roll_number,
#         "event_id": data.event_id
#     })
    
#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found in attendance list")
    
#     # Update the record to mark attendance
#     result = attendance_collection.update_one(
#         {"roll_number": data.roll_number, "event_id": data.event_id},
#         {
#             "$set": {
#                 "is_present": True,
#                 "marked_by": current_user["email"],
#                 "marked_at": datetime.utcnow().isoformat()
#             }
#         }
#     )
    
#     if result.modified_count == 0:
#         raise HTTPException(status_code=500, detail="Failed to mark attendance")
    
#     # Get the updated record
#     updated_record = attendance_collection.find_one({
#         "roll_number": data.roll_number,
#         "event_id": data.event_id
#     })
    
#     # Convert ObjectId to string
#     updated_record["_id"] = str(updated_record["_id"])
    
#     return {"success": True, "message": "Attendance marked successfully", "data": updated_record}

# def search_student_service(roll_number: str, event_id: str, current_user: dict):
#     if attendance_collection is None:
#         raise HTTPException(status_code=503, detail="Service unavailable")
    
#     # Get the student record
#     student = attendance_collection.find_one({
#         "roll_number": roll_number,
#         "event_id": event_id
#     })
    
#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found in attendance list")
    
#     # Convert ObjectId to string
#     student["_id"] = str(student["_id"])
    
#     return {"success": True, "data": student}

# def get_events_service(current_user: dict):
#     if attendance_collection is None:
#         raise HTTPException(status_code=503, detail="Service unavailable")
    
#     # Get unique event IDs
#     events = attendance_collection.distinct("event_id")
    
#     return {"success": True, "data": events}


from fastapi import HTTPException, UploadFile
from fastapi import HTTPException
from database.connection import attendance_collection, users_collection
from database.models import AttendanceRecord, MarkAttendance
import csv
from io import StringIO
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

async def upload_attendance_service(file: UploadFile, current_user: dict):
    if attendance_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    # Allow common CSV MIME types
    allowed_types = {"text/csv", "application/csv", "application/vnd.ms-excel"}
    if file.content_type not in allowed_types:
        logger.error(f"Invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read the CSV file
        content = await file.read()
        # Decode with utf-8-sig to handle BOM
        decoded_content = content.decode('utf-8-sig').strip()
        csv_file = StringIO(decoded_content)
        reader = csv.DictReader(csv_file)
        
        # Log fieldnames for debugging
        logger.info(f"CSV fieldnames: {reader.fieldnames}")
        
        if not reader.fieldnames:
            logger.error("No headers found in CSV")
            raise HTTPException(status_code=400, detail="CSV is empty or has no headers")
        
        # Normalize headers: strip whitespace and convert to lowercase
        normalized_fieldnames = [field.strip().lower() for field in reader.fieldnames]
        logger.info(f"Normalized fieldnames: {normalized_fieldnames}")
        
        # Validate headers
        required_headers = {"name", "roll_number"}
        if not required_headers.issubset(normalized_fieldnames):
            logger.error(f"Required headers {required_headers} not found in {normalized_fieldnames}")
            raise HTTPException(status_code=400, detail="CSV must contain 'name' and 'roll_number' columns")
        
        students = []
        for row in reader:
            # Use original fieldnames to access row data, but normalize for lookup
            normalized_row = {k.strip().lower(): v for k, v in row.items()}
            student = AttendanceRecord(
                name=normalized_row["name"],
                roll_number=normalized_row["roll_number"],
                event_id="default_event",
                is_present=False,
                marked_by=None,
                marked_at=None
            )
            students.append(student.dict())
        
        # Clear existing attendance for the event
        attendance_collection.delete_many({"event_id": "default_event"})
        
        # Insert new attendance records
        if students:
            attendance_collection.insert_many(students)
        
        logger.info(f"Uploaded {len(students)} student records")
        return {"success": True, "message": "Attendance uploaded successfully"}
    
    except UnicodeDecodeError as e:
        logger.error(f"Unicode decode error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid CSV encoding, please use UTF-8")
    except csv.Error as e:
        logger.error(f"CSV parsing error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        logger.error(f"Unexpected error uploading attendance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload attendance: {str(e)}")

def get_attendance_list_service():
    if attendance_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    try:
        students = list(attendance_collection.find({"event_id": "default_event"}))
        for student in students:
            student["_id"] = str(student["_id"])
        return {"success": True, "students": students}
    except Exception as e:
        logger.error(f"Error fetching attendance list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch attendance list")

def search_student_service(roll_number: str):
    if attendance_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    try:
        student = attendance_collection.find_one({"roll_number": roll_number, "event_id": "default_event"})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if student.get("is_present"):
            raise HTTPException(status_code=400, detail="Student already marked as present")
        
        student["_id"] = str(student["_id"])
        return student
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error searching student: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search student")

def mark_attendance_service(request: MarkAttendance, current_user: dict):
    if attendance_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    try:
        result = attendance_collection.update_one(
            {"roll_number": request.roll_number, "event_id": request.event_id, "is_present": False},
            {
                "$set": {
                    "is_present": True,
                    "marked_by": current_user.get("email"),
                    "marked_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Student not found or already marked")
        
        return {"success": True, "message": "Attendance marked successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking attendance: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to mark attendance")