"""Multi-college email domain validation."""
from typing import Any


def validate_email_domain(email: str, college: dict[str, Any]) -> bool:
    """
    Check that email ends with the college's domain.
    Reject wrong domain login. Email is normalized to lowercase.
    """
    if not email or not college:
        return False
    domain = college.get("domain")
    if not domain:
        return False
    email_lower = email.strip().lower()
    domain_lower = domain.strip().lower()
    # Must end with @domain (e.g. @gmu.edu)
    return email_lower.endswith(f"@{domain_lower}")
