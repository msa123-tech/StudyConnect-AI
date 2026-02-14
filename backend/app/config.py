"""Application configuration. Ready for env vars and future DB connection."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Base
BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "studyconnect-dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Future MySQL (placeholder — do not use yet)
# DATABASE_URL = os.getenv("DATABASE_URL", "mysql+aiomysql://user:pass@localhost:3306/studyconnect")
