# StudyConnect Backend (Phase 1 & 2)

FastAPI backend with JWT auth, bcrypt, and multi-college email validation. MySQL persistence via SQLAlchemy and Alembic.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

## Database

1. Create database in MySQL Workbench:
   ```sql
   CREATE DATABASE studyconnect;
   ```

2. Copy `.env.example` to `.env` and set your MySQL credentials:
   ```
   DATABASE_URL=mysql+pymysql://USER:PASSWORD@localhost:3306/studyconnect
   SECRET_KEY=your-secret-key-change-in-production
   ```

3. Run migrations:
   ```bash
   alembic upgrade head
   ```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /colleges | List colleges for dropdown |
| POST | /auth/login | Login (body: email, password, college_id). Auto-creates user if new. |
| GET | /auth/me | Current user (requires `Authorization: Bearer <token>`) |

## Env

- `DATABASE_URL` — MySQL connection string (use same credentials as Workbench)
- `SECRET_KEY` — JWT secret (change in production)
