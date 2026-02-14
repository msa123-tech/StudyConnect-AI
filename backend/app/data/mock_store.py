"""In-memory mock storage for Phase 1 & 2. Replace with DB later."""

# Colleges list for dropdown and domain validation
COLLEGES = [
    {"id": 1, "name": "George Mason University", "domain": "gmu.edu"},
    {"id": 2, "name": "Virginia Tech", "domain": "vt.edu"},
    {"id": 3, "name": "UCLA", "domain": "ucla.edu"},
    {"id": 4, "name": "NYU", "domain": "nyu.edu"},
    {"id": 5, "name": "Harvard University", "domain": "harvard.edu"},
    {"id": 6, "name": "Stanford University", "domain": "stanford.edu"},
    {"id": 7, "name": "University of Texas", "domain": "utexas.edu"},
]

# Mock users: key = normalized email, value = { user_id, email, password_hash, college_id }
_users: dict[str, dict] = {}
_user_id_counter = 1


def get_college_by_id(college_id: int) -> dict | None:
    for c in COLLEGES:
        if c["id"] == college_id:
            return c
    return None


def get_user_by_email(email: str) -> dict | None:
    return _users.get(email.strip().lower())


def create_user(email: str, password_hash: str, college_id: int) -> dict:
    global _user_id_counter
    email_lower = email.strip().lower()
    user = {
        "user_id": _user_id_counter,
        "email": email_lower,
        "password_hash": password_hash,
        "college_id": college_id,
    }
    _users[email_lower] = user
    _user_id_counter += 1
    return user
