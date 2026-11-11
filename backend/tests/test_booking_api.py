"""Exercise the disabled booking route locally; never submit to a live site."""
import importlib.util
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def booking_app(monkeypatch):
    monkeypatch.setenv("MONGO_URL", "mongodb://127.0.0.1:27017")
    monkeypatch.setenv("DB_NAME", "yung_dsa_test")
    spec = importlib.util.spec_from_file_location("booking_test_server", Path(__file__).parents[1] / "server.py")
    server = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(server)
    database = MagicMock()
    database.booking_inquiries.insert_one = AsyncMock()
    monkeypatch.setattr(server, "db", database)
    with TestClient(server.app) as client:
        yield client, database
    server.client.close()


@pytest.mark.parametrize("payload", [
    {"name": "Test Booker", "email": "test@example.com", "inquiry_type": "Live Shows", "message": "Test inquiry"},
    {"email": "test@example.com"},
    {},
])
def test_booking_requests_are_rejected_without_storage(booking_app, payload):
    client, database = booking_app
    response = client.post("/api/booking-inquiries", json=payload)
    assert response.status_code == 403
    assert "independent website concept" in response.json()["detail"]
    assert "received" not in response.json()
    database.booking_inquiries.insert_one.assert_not_called()


def test_disabled_route_does_not_require_or_read_a_form(booking_app):
    client, database = booking_app
    response = client.post("/api/booking-inquiries", content="not valid JSON", headers={"Content-Type": "application/json"})
    assert response.status_code == 403
    database.booking_inquiries.insert_one.assert_not_called()
