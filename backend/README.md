# StudyConnect Backend (Phase 1 & 2)

FastAPI backend with JWT auth, bcrypt, and multi-college email validation. No database yet — in-memory mock storage. Ready for teammate to plug DB and Alembic migrations.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API: http://127.0.0.1:8000
- Root GET: http://127.0.0.1:8000/ → `{ "message": "StudyConnect backend running" }`
- Swagger UI: http://127.0.0.1:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /colleges | List colleges for dropdown |
| POST | /auth/login | Login (body: email, password, college_id). Auto-creates user if new. |
| GET | /auth/me | Current user (requires `Authorization: Bearer <token>`) |

## Env (optional)

Create `.env`:

- `SECRET_KEY` — JWT secret (default: dev placeholder)
- `DATABASE_URL` — for future Alembic (e.g. `mysql+pymysql://user:pass@localhost:3306/studyconnect`)

## Verify functionality (Phase 1 & 2)

1. **Root** — Open http://127.0.0.1:8000/ and confirm `{ "message": "StudyConnect backend running" }`.
2. **Swagger UI** — Open http://127.0.0.1:8000/docs.
3. **GET /colleges** — Call it; response should be the college list (e.g. George Mason University, Virginia Tech, UCLA, etc.).
4. **POST /auth/login (valid)** — Body: `email` (e.g. `student@gmu.edu`), `password` (any), `college_id` (e.g. `1` for GMU). Expect 200 with `access_token` and `college_name`. Passwords are hashed with bcrypt in mock storage; JWT includes `user_id`, `college_id`, `email`.
5. **POST /auth/login (invalid domain)** — Use an email that does not match the college domain (e.g. `user@gmail.com` with `college_id: 1`). Expect 400 and rejection.
6. **GET /auth/me** — In Swagger, click **Authorize**, paste the JWT from step 4 (e.g. `Bearer <token>` or just the token if the UI adds Bearer). Call GET /auth/me; expect 200 with logged-in user details (`email`, `college_id`, `college_name`).

If all of the above pass, the backend is working for Phase 1 and Phase 2 authentication.

## Alembic

Migrations are set up; no models yet. When DB is added:

1. Define SQLAlchemy models and set `target_metadata` in `alembic/env.py`.
2. `alembic revision --autogenerate -m "add users table"`
3. `alembic upgrade head`
