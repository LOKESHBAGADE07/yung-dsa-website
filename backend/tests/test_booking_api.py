import os

import pytest
import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


def test_booking_inquiry_accepts_valid_payload(api_client):
    response = api_client.post(
        f"{BASE_URL}/api/booking-inquiries",
        json={
            "name": "TEST_Artist Booker",
            "email": "test-booker@example.com",
            "phone": "+91 9999999999",
            "organization": "TEST_Events Co",
            "inquiry_type": "Live Shows",
            "city": "Mumbai",
            "event_date": "2025-12-01",
            "budget": "TEST_50000",
            "message": "TEST booking inquiry",
        },
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["received"] is True
    assert isinstance(data["id"], str) and data["id"]
    assert "management" in data["message"].lower()


def test_booking_inquiry_rejects_missing_required_fields(api_client):
    response = api_client.post(
        f"{BASE_URL}/api/booking-inquiries",
        json={"email": "test-booker@example.com"},
        timeout=20,
    )
    assert response.status_code == 422
    assert "detail" in response.json()