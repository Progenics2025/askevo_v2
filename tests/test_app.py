"""
Tests for the Flask application.
"""

import pytest
from askevo.app import create_app


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app({"TESTING": True})
    yield app


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    def test_health_check(self, client):
        """Test the health endpoint returns healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestIndexEndpoint:
    """Tests for the index page."""

    def test_index_returns_html(self, client):
        """Test that the index page returns HTML."""
        response = client.get("/")
        assert response.status_code == 200
        assert b"AskEvo" in response.data


class TestChatEndpoint:
    """Tests for the chat API endpoint."""

    def test_chat_with_valid_message(self, client):
        """Test chat endpoint with a valid message."""
        response = client.post(
            "/api/chat", json={"message": "Hello"}, content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert "response" in data

    def test_chat_without_message(self, client):
        """Test chat endpoint without a message."""
        response = client.post("/api/chat", json={}, content_type="application/json")
        assert response.status_code == 400
        data = response.get_json()
        assert "error" in data

    def test_chat_with_empty_message(self, client):
        """Test chat endpoint with empty message."""
        response = client.post(
            "/api/chat", json={"message": "   "}, content_type="application/json"
        )
        assert response.status_code == 400
        data = response.get_json()
        assert "error" in data

    def test_chat_about_genetic_condition(self, client):
        """Test chat asking about a genetic condition."""
        response = client.post(
            "/api/chat",
            json={"message": "Tell me about cystic fibrosis"},
            content_type="application/json",
        )
        assert response.status_code == 200
        data = response.get_json()
        assert "Cystic Fibrosis" in data["response"]


class TestSearchEndpoint:
    """Tests for the search API endpoint."""

    def test_search_with_query(self, client):
        """Test search endpoint with a query."""
        response = client.get("/api/search?q=cystic")
        assert response.status_code == 200
        data = response.get_json()
        assert "results" in data
        assert "Cystic Fibrosis" in data["results"]

    def test_search_empty_query(self, client):
        """Test search endpoint with empty query."""
        response = client.get("/api/search?q=")
        assert response.status_code == 200
        data = response.get_json()
        assert data["results"] == []


class TestConditionEndpoint:
    """Tests for the condition details API endpoint."""

    def test_get_existing_condition(self, client):
        """Test getting details of an existing condition."""
        response = client.get("/api/condition/Cystic%20Fibrosis")
        assert response.status_code == 200
        data = response.get_json()
        assert data["name"] == "Cystic Fibrosis"

    def test_get_nonexistent_condition(self, client):
        """Test getting details of a non-existent condition."""
        response = client.get("/api/condition/NonExistent")
        assert response.status_code == 404
        data = response.get_json()
        assert "error" in data


class TestClearEndpoint:
    """Tests for the clear history endpoint."""

    def test_clear_history(self, client):
        """Test clearing conversation history."""
        # First, send a message
        client.post("/api/chat", json={"message": "Hello"}, content_type="application/json")

        # Clear history
        response = client.post("/api/clear")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "cleared"
