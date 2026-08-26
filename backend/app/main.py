# from fastapi import FastAPI
# from app.api.router import api_router

# app = FastAPI()

# app.include_router(api_router, prefix="/api")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="localhost", port=4000)

from app.core.document_loader import JSONDocumentLoader
from app.config.logger import setup_logging
from app.core.embedding_manager import EmbeddingManager
from app.core.qdrant_vector_store import QdrantVectorStore

setup_logging()

def main():
    doc_loader = JSONDocumentLoader("data/food_standards_dataset.jsonl")
    documents = doc_loader.load()

    if not documents:
        raise ValueError("Failed to create the document struture")

    # Once the documents has been loaded successfully.
    # We need to create a EmbeddingManager Object.
    embedding_manager = EmbeddingManager()

    # Now we need to create the create the object of the vector store.
    dense_dim = embedding_manager.get_embeddings_dimesion()

    vector_store = QdrantVectorStore(
        collection_name="bis_standards",
        dense_dim=dense_dim,
        embed_fn=embedding_manager.generate_embeddings
    )

    # Right now for testing we are not provding the payload_index_fields and all.
    vector_store.create_collection()
    result = vector_store.add_documents(documents=documents)
    print(result)


if __name__ == "__main__":
    main()