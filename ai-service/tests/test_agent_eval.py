import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "999 Combo Store" in data["service"]

def test_chat_product_search():
    payload = {
        "user_id": "usr_test_123",
        "channel": "web",
        "message": "Show me slim fit cotton shirts for men"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["retrieved_products"]) > 0
    assert data["retrieved_products"][0]["category"] == "Men"

def test_chat_combo_session_creation():
    payload = {
        "user_id": "usr_test_123",
        "channel": "whatsapp",
        "message": "I want to start a 999 combo deal"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "999 combo" in data["reply"].lower() or "combo" in data["reply"].lower()

def test_chat_order_tracking():
    payload = {
        "user_id": "usr_test_123",
        "channel": "web",
        "message": "Where is my order ORD-999-01?"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "SHIPPED" in data["reply"]

def test_chat_human_handoff():
    payload = {
        "user_id": "usr_test_123",
        "channel": "web",
        "message": "I want to speak with human support"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["requires_human_handoff"] is True
