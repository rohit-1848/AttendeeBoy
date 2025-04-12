from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from middleware.auth_middleware import exception_handling
from routes.auth import router as auth_router
from routes.home import router as home_router
from routes.profile import router as profile_router
from database.connection import users_collection, attendance_collection, redis_client
from utils.config import EMAIL_USERNAME, EMAIL_PASSWORD
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

# Add CORS middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5176", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],  # Allow common development ports
    allow_credentials=True,  # Allows sending cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

# Then add the custom exception-handling middleware
app.middleware("http")(exception_handling)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(home_router, prefix="/api/home")
app.include_router(profile_router, prefix="/api/profile")

@app.get("/health")
async def health_check():
    health = {
        "status": "ok",
        "mongo_connected": all(x is not None for x in [users_collection,attendance_collection ]),
        "redis_connected": redis_client is not None,
        "email_configured": bool(EMAIL_USERNAME and EMAIL_PASSWORD)
    }
    return health

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)