import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_dynamic_rag_product_search():
    payload = {
        "user_id": "usr_test_1",
        "channel": "web",
        "message": "Show me white shirt size M"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["retrieved_products"]) > 0
    prod = data["retrieved_products"][0]
    assert "image_url" in prod
    assert "available_sizes" in prod
    assert "color" in prod

def test_size_advisor_tool():
    payload = {
        "user_id": "usr_test_2",
        "channel": "web",
        "message": "My height is 178cm and weight is 74kg, what size should I get?"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Recommended Size" in data["reply"] or "L" in data["reply"]

def test_returning_customer_profile():
    payload = {
        "user_id": "usr_returning_101",
        "channel": "web",
        "message": "Hi, what products match my style?"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Rahul Sharma" in data["reply"] or "returning" in data["reply"].lower()

def test_human_support_escalation():
    payload = {
        "user_id": "usr_test_3",
        "channel": "web",
        "message": "I need human support agent"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["requires_human_handoff"] is True
