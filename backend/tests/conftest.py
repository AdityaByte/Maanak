import pytest


@pytest.fixture
def mock_file(tmp_path):

    def create_file(content):
        file = tmp_path / "dataset.json"
        file.write_text(content, encoding="utf-8")
        return file

    return create_file