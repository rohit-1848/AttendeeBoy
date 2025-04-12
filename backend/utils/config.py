import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv() # Load environment variables from .env file

# # Fallback to build from user/pass
# raw_user = os.getenv("MONGODB_USER")
# raw_pass = os.getenv("MONGODB_PASSWORD")
# encoded_user = quote_plus(raw_user)
# encoded_pass = quote_plus(raw_pass)
# # MONGODB_URL = f"mongodb+srv://{encoded_user}:{encoded_pass}@cluster.lh9d1zr.mongodb.net/AttendeeBoy?retryWrites=true&w=majority&tls=true"
# MONGODB_URL = f"mongodb+srv://{encoded_user}:{encoded_pass}@cluster.lh9d1zr.mongodb.net/AttendeeBoy?retryWrites=true&w=majority"
MONGODB_URL = os.getenv("MONGODB_URL")
# logger.info(f"Loaded MONGODB_URL: {MONGODB_URL}")
# MONGODB_URL="mongodb+srv://john:RohitJohnCluster1578@cluster.lh9d1zr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster&tls=true"
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
OTP_EXPIRE_MINUTES = 10
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
ADMIN_EMAILS = ["ADMIN_EMAILS"]



# REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
# REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
# SECRET_KEY = "your-secret-key"
# logger.info(f"SECRET_KEY loaded: {SECRET_KEY}")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60
# OTP_EXPIRE_MINUTES = 10
# EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
# EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
# EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "")
# EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
# ADMIN_EMAILS = ["ADMIN_EMAILS"]

