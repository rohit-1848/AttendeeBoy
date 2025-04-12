from pymongo import MongoClient
import redis
from utils.config import MONGODB_URL, REDIS_HOST, REDIS_PORT
import logging


logger = logging.getLogger(__name__)
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
# uri = "mongodb+srv://john:Rohit1578@cluster.lh9d1zr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
# Create a new client and connect to the server
# MongoDB Connection
try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    # client = MongoClient(uri, server_api=ServerApi('1'))
    client.server_info()
    db = client["AttendeeBoy"]

    # Define collections
    users_collection = db["users"]
    attendance_collection = db["attendance"]

    logger.info("Connected to MongoDB - AttendeeBoy")

except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    client = None
    db = None
    users_collection = None
    attendance_collection = None

# Redis Connection
try:
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
    redis_client.ping()
    logger.info("Redis connection successful")
except Exception as e:
    logger.error(f"Redis connection error: {e}")
    redis_client = None


