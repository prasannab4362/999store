import pytest
from app.rag.retriever import retriever

def test_vector_similarity_ranking():
    # Semantic search query for "breathable cotton formal shirt"
    results = retriever.search_catalog(query="breathable cotton formal shirt", category="Shirts")
    assert len(results) > 0
    # Highest ranked item should be a shirt with breathable cotton description
    assert "Shirt" in results[0]["name"]
    assert "cotton" in results[0]["short_description"].lower()

def test_analytics_endpoint_data():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/analytics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "metrics" in data
    assert "total_active_sessions" in data["metrics"]
