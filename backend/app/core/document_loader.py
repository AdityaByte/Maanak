import json
from pathlib import Path
from langchain_core.documents import Document


class JSONDocumentLoader:
    """
    This class mainly loads the JSONDataSet from the respective directory and convert that to the
    LangChain Document Data Structure.
    """

    def __init__(self, path: str) -> None:
        self._path: Path = Path(path)

    def load(self) -> list[Document]:

        if not self._path.exists():
            raise FileNotFoundError(f"JSON documents file not found: {self._path}")

        documents: list[Document] = []

        with open(self._path, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, start=1):
                line = line.strip() # removing the leading and trailing spaces.
                if not line:
                    continue
                try:
                    record = json.loads(line)
                except json.JSONDecodeError as e:
                    raise ValueError(f"Invalid JSON document found on line {line_num} of {self._path}: {e}") from e

                if "page_content" not in record:
                    raise ValueError(f"Line {line_num} missing 'page_content' key")

                documents.append(Document(
                    page_content=record["page_content"],
                    metadata=record.get("metadata", {}),
                ))

        return documents