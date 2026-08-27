from app.core.document_loader import JSONDocumentLoader
from app.core.qdrant_vector_store import QdrantVectorStore


class AdminService:
    def __init__(self, vector_store):
        self.vector_store: QdrantVectorStore = vector_store

    async def load_data(self) -> dict[str, any]:
        doc_loader = JSONDocumentLoader("data/food_standards_dataset.jsonl")
        documents = doc_loader.load()

        if not documents:
            raise ValueError("Failed to create the document struture")

        self.vector_store.create_collection()
        result = self.vector_store.add_documents(documents)
        return result