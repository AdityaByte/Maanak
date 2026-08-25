from app.core.document_loader import JSONDocumentLoader
import pytest


def test_load_valid_json_documents(mock_file):
    """Mocking the file and checking it loads the data or not."""

    dummy_data = (
        '{"page_content": "Milk standard", "metadata": {"id": "IS123"}}\n'
        '{"page_content": "Rice standard", "metadata": {"id": "IS456"}}\n'
    )

    file = mock_file(dummy_data)
    loader = JSONDocumentLoader(str(file))
    documents = loader.load()

    assert len(documents) == 2
    assert documents[0].page_content == "Milk standard"
    assert documents[0].metadata == {"id": "IS123"}

    assert documents[1].page_content == "Rice standard"
    assert documents[1].metadata == {"id": "IS456"}

def test_load_file_not_found():

    loader = JSONDocumentLoader("dataset.json")
    with pytest.raises(
        FileNotFoundError,
        match="JSON documents file not found"
    ):
        loader.load()

def test_load_invalid_json(mock_file):

    invalid_json_data = '{"page_content": "Valid"}\ninvalid json\n'
    file = mock_file(invalid_json_data)
    loader = JSONDocumentLoader(str(file))

    with pytest.raises(ValueError, match="Invalid JSON document"):
        loader.load()

def test_load_missing_page_content(mock_file):

    data = '{"metadata": {"id": "IS123"}}\n'
    file = mock_file(data)
    loader = JSONDocumentLoader(str(file))

    with pytest.raises(ValueError, match="missing 'page_content' key"):
        loader.load()

def test_load_skips_empty_lines(mock_file):

    data = (
        '\n'
        '{"page_content": "Milk", "metadata": {}}\n'
        '\n'
        '{"page_content": "Rice", "metadata": {}}\n'
    )
    file = mock_file(data)
    loader = JSONDocumentLoader(str(file))

    documents = loader.load()

    assert len(documents) == 2