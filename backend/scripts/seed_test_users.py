"""
Seed 10 test users for login testing.
Run from backend directory: python scripts/seed_test_users.py
"""
import sys
from pathlib import Path

# Ensure backend app is on path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import User, UserRole
from app.utils.password_handler import hash_password

# 10 test users: (email, plain_password, college_id)
# college_id: 1=GMU, 2=VT, 3=UCLA, 4=NYU, 5=Harvard, 6=Stanford, 7=UT
TEST_USERS = [
    ("student1@gmu.edu", "TestPass1!", 1),
    ("student2@gmu.edu", "TestPass2!", 1),
    ("demo@vt.edu", "Demo123!", 2),
    ("test@ucla.edu", "Test123!", 3),
    ("user@nyu.edu", "User123!", 4),
    ("john@harvard.edu", "Harvard1!", 5),
    ("jane@stanford.edu", "Stanford1!", 6),
    ("bob@utexas.edu", "Texas123!", 7),
    ("alice@gmu.edu", "Alice123!", 1),
    ("charlie@vt.edu", "Charlie1!", 2),
]

def main():
    db = SessionLocal()
    created = []
    try:
        for email, password, college_id in TEST_USERS:
            existing = db.query(User).filter(User.email == email, User.college_id == college_id).first()
            if existing:
                print(f"  Skip (exists): {email}")
                created.append((email, password, college_id))
                continue
            user = User(
                email=email,
                hashed_password=hash_password(password),
                college_id=college_id,
                role=UserRole.student,
            )
            db.add(user)
            created.append((email, password, college_id))
            print(f"  Created: {email}")
        db.commit()
    finally:
        db.close()

    print("\n" + "=" * 60)
    print("TEST LOGIN CREDENTIALS (use these on the login page)")
    print("=" * 60)
    print(f"{'#':<3} {'Email':<25} {'Password':<12} {'College ID'}")
    print("-" * 60)
    for i, (email, password, college_id) in enumerate(created, 1):
        print(f"{i:<3} {email:<25} {password:<12} {college_id}")
    print("=" * 60)
    print("\nSelect the college in the dropdown first, then use the email and password above.")


if __name__ == "__main__":
    main()
