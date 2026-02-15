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

# RAG & uploads
UPLOAD_DIR = BASE_DIR / "uploads"
VECTOR_INDEX_DIR = BASE_DIR / "vector_indexes"
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", "10_000_000"))  # 10 MB
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

# Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:0.6b")

# ElevenLabs TTS (optional - voice AI assistant)
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel
