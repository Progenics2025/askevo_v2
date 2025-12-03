"""
Tests for the GeneticAssistant class.
"""

import pytest
from askevo.genetic_assistant import GeneticAssistant


@pytest.fixture
def assistant():
    """Create a GeneticAssistant instance for testing."""
    return GeneticAssistant()


class TestGeneticAssistantInit:
    """Tests for GeneticAssistant initialization."""

    def test_initialization(self, assistant):
        """Test that the assistant initializes correctly."""
        assert assistant is not None
        assert assistant.knowledge_base is not None
        assert assistant.conversation_history == []

    def test_knowledge_base_has_conditions(self, assistant):
        """Test that the knowledge base contains genetic conditions."""
        assert "conditions" in assistant.knowledge_base
        assert len(assistant.knowledge_base["conditions"]) > 0

    def test_knowledge_base_has_inheritance_patterns(self, assistant):
        """Test that the knowledge base contains inheritance patterns."""
        assert "inheritance_patterns" in assistant.knowledge_base
        assert len(assistant.knowledge_base["inheritance_patterns"]) > 0

    def test_knowledge_base_has_genetic_tests(self, assistant):
        """Test that the knowledge base contains genetic tests."""
        assert "genetic_tests" in assistant.knowledge_base
        assert len(assistant.knowledge_base["genetic_tests"]) > 0


class TestGetResponse:
    """Tests for the get_response method."""

    def test_greeting_response(self, assistant):
        """Test response to greeting messages."""
        response = assistant.get_response("Hello")
        assert "Welcome" in response or "help" in response.lower()
        assert len(assistant.conversation_history) == 2

    def test_cystic_fibrosis_query(self, assistant):
        """Test response about cystic fibrosis."""
        response = assistant.get_response("Tell me about cystic fibrosis")
        assert "Cystic Fibrosis" in response
        assert "CFTR" in response
        assert "Autosomal Recessive" in response

    def test_huntingtons_query(self, assistant):
        """Test response about Huntington's disease."""
        response = assistant.get_response("What is Huntington's disease?")
        assert "Huntington" in response
        assert "HTT" in response

    def test_sickle_cell_query(self, assistant):
        """Test response about sickle cell disease."""
        response = assistant.get_response("Tell me about sickle cell")
        assert "Sickle Cell" in response
        assert "HBB" in response

    def test_down_syndrome_query(self, assistant):
        """Test response about Down syndrome."""
        response = assistant.get_response("What is Down syndrome?")
        assert "Down Syndrome" in response
        assert "21" in response

    def test_inheritance_query(self, assistant):
        """Test response about inheritance patterns."""
        response = assistant.get_response("Tell me about inheritance patterns")
        assert "Inheritance" in response
        assert "Dominant" in response or "Recessive" in response

    def test_autosomal_dominant_query(self, assistant):
        """Test response about autosomal dominant inheritance."""
        response = assistant.get_response("Explain autosomal dominant inheritance")
        assert "Dominant" in response
        assert "50%" in response

    def test_genetic_testing_query(self, assistant):
        """Test response about genetic tests."""
        response = assistant.get_response("What genetic tests are available?")
        assert "test" in response.lower() or "Test" in response

    def test_karyotype_query(self, assistant):
        """Test response about karyotype testing."""
        response = assistant.get_response("Tell me about karyotype testing")
        assert "Karyotype" in response
        assert "chromosome" in response.lower()

    def test_symptom_query(self, assistant):
        """Test response to symptom-based queries."""
        response = assistant.get_response("Patient has muscle weakness and cognitive symptoms")
        assert "Differential" in response or "condition" in response.lower()

    def test_general_query(self, assistant):
        """Test response to unrecognized queries."""
        response = assistant.get_response("random query about something")
        assert len(response) > 0

    def test_conversation_history_updates(self, assistant):
        """Test that conversation history is maintained."""
        assistant.get_response("Hello")
        assert len(assistant.conversation_history) == 2
        assert assistant.conversation_history[0]["role"] == "user"
        assert assistant.conversation_history[1]["role"] == "assistant"


class TestSearchConditions:
    """Tests for the search_conditions method."""

    def test_search_by_name(self, assistant):
        """Test searching conditions by name."""
        results = assistant.search_conditions("cystic")
        assert "Cystic Fibrosis" in results

    def test_search_by_gene(self, assistant):
        """Test searching conditions by gene name."""
        results = assistant.search_conditions("CFTR")
        assert "Cystic Fibrosis" in results

    def test_search_no_results(self, assistant):
        """Test search with no matching results."""
        results = assistant.search_conditions("nonexistent123")
        assert results == []

    def test_search_case_insensitive(self, assistant):
        """Test that search is case insensitive."""
        results = assistant.search_conditions("HUNTINGTON")
        assert "Huntington's Disease" in results


class TestGetConditionDetails:
    """Tests for the get_condition_details method."""

    def test_get_existing_condition(self, assistant):
        """Test getting details for an existing condition."""
        details = assistant.get_condition_details("Cystic Fibrosis")
        assert details is not None
        assert details["name"] == "Cystic Fibrosis"
        assert "gene" in details
        assert "symptoms" in details

    def test_get_nonexistent_condition(self, assistant):
        """Test getting details for a non-existent condition."""
        details = assistant.get_condition_details("NonExistent Disease")
        assert details is None

    def test_get_condition_partial_match(self, assistant):
        """Test getting condition with partial name match."""
        details = assistant.get_condition_details("Sickle")
        assert details is not None
        assert "Sickle" in details["name"]


class TestClearHistory:
    """Tests for the clear_history method."""

    def test_clear_history(self, assistant):
        """Test clearing conversation history."""
        assistant.get_response("Hello")
        assert len(assistant.conversation_history) > 0

        assistant.clear_history()
        assert assistant.conversation_history == []
