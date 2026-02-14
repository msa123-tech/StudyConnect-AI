"""Application configuration. Ready for env vars and future DB connection."""
import os
from pathlib import Path

from dotenv import load_dotenv

# Base (backend directory)
BASE_DIR = Path(__file__).resolve().parent.parent
# Always load .env from backend directory, regardless of cwd when starting the app
load_dotenv(BASE_DIR / ".env")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "studyconnect-dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# MySQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/studyconnect"
)
