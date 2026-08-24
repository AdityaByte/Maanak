import json
from pathlib import Path
from typing import List, Dict, Any, Union
from langchain_core.documents import Document


class JSONDocumentLoader:
    """
    Yeh class json file se data read karke LangChain Documents me convert karti hai.
    Sasta aur simple document loader!
    """

    def __init__(self, file_path: Union[str, Path]) -> None:
        """
        Constructor method: file ka path set karta hai.
        """
        # path ko Path object me save kar rahe hain taaki issue na aye
        self._file_path: Path = Path(file_path)

    def _read_json_file(self) -> Union[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Protected method: JSON file ko open and read karne ke liye.
        """
        # checking if file actual me exist karti hai ya nahi
        if not self._file_path.exists():
            raise FileNotFoundError(f"Bhai file missing hai path par: {self._file_path}")

        # normal file opening process in utf-8 encoding
        with open(self._file_path, mode="r", encoding="utf-8") as f:
            data = json.load(f)
            return data

    def _create_document(self, data: Dict[str, Any], index: int) -> Document:
        """
        Helper funtion to convert dict object into a proper Document object.
        """
        # dict content ko standard string format me convrt kar rhe hai
        text_content: str = json.dumps(data, indent=2)
        
        # extra details or metadata list ka index ke sath
        doc_metadata: Dict[str, Any] = {
            "source": str(self._file_path),
            "index": index
        }
        
        return Document(page_content=text_content, metadata=doc_metadata)

    def load(self) -> List[Document]:
        """
        Main function jo sare json data ko load karke return karega.
        """
        # internal method call to fetch raw json dataset
        raw_dataset = self._read_json_file()
        doc_list: List[Document] = []

        # handling scenario jab json array/list ho
        if isinstance(raw_dataset, list):
            for i, item in enumerate(raw_dataset):
                if isinstance(item, dict):
                    doc_list.append(self._create_document(item, i))
                else:
                    # fall back handling for non-dict items
                    doc_list.append(Document(
                        page_content=str(item), 
                        metadata={"source": str(self._file_path), "index": i}
                    ))
        # scenario jab base json object pure dict hi ho
        elif isinstance(raw_dataset, dict):
            doc_list.append(self._create_document(raw_dataset, 0))

        return doc_list




    # reference :   https://github.com/langchain-ai/langchain/blob/master/libs/core/langchain_core/document_loaders/base.py
    # https://docs.kanaries.net/topics/LangChain/langchain-document-loader