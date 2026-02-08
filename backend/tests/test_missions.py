import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_start_mission():
    response = client.post("/api/missions/start", json={
        "user_id": 1,
        "device_id": "test_device_uuid",
        "initial_alpha": 0.0,
        "initial_beta": 0.0,
        "initial_gamma": 0.0,
        "gps_location": {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "accuracy": 10.0
        }
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "mission_id" in data
    assert data["status"] == "started"
