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
import dotenv
import os
from qdrant_client import QdrantClient
import logging
from app.core.retriever.retriever import HybridRetriever
from app.core.retriever.query_router import QueryRouter
from app.core.context_builder import ContextBuilder

logger = logging.getLogger(__name__)

dotenv.load_dotenv(".env.dev")
setup_logging()

def init_qdrant_client() -> QdrantClient:
    url = os.getenv("QDRANT_SERVER_URL")
    if url == "":
        logger.error(f"Failed to load the environment variable for server url.")
        exit(1)

    return QdrantClient(url=url)

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

    client: QdrantClient = init_qdrant_client()
    collection_name: str = os.getenv("QDRANT_COLLECTION_NAME")

    if collection_name == "":
        logger.error(f"Failed to load the environment variable for collection name.")
        exit(1)

    vector_store = QdrantVectorStore(
        collection_name="bis_standards",
        dense_dim=dense_dim,
        embed_fn=embedding_manager.generate_embeddings,
        client=client
    )

    categories = vector_store.get_categories()

    # Right now for testing we are not provding the payload_index_fields and all.
    # vector_store.create_collection()
    # result = vector_store.add_documents(documents=documents)
    # print(result)

    # Retrieval Pipeline.

    query_router = QueryRouter(known_categories=categories)

    retriever = HybridRetriever(
        client=client,
        collection_name=collection_name,
        embed_fn=embedding_manager.generate_embeddings,
        router=query_router
    )

    query = "Acesulfame potassium used as a high-intensity sweetener and flavour enhancer in food additives. The substance is heat stable, soluble in water, and may be blended with other sweeteners such as sucralose or aspartame."

    result = retriever.retrieve(query=query)
    print(result)

    # Now we need to check the context.
    context_builder = ContextBuilder()
    print(context_builder.build(result))

def test():
    client = init_qdrant_client()
    print(client.get_collections())

    print(
        client.count(
            collection_name="bis_standards",
            exact=True
        )
    )

    # collection = client.get_collection("bis_standards")
    # print(collection.config.params.vectors)

    query = "Food grade artificial sweetener acesulfame potassium"

    embedding_manager = EmbeddingManager()

    query_vector = embedding_manager.generate_embeddings(query)

    results = client.query_points(
        collection_name="bis_standards",
        query=query_vector,
        using="dense",
        limit=5,
        with_payload=True,
    )

    for result in results.points:
        print("ID:", result.id)
        print("Score:", result.score)
        print("Payload:", result.payload)
        print("=" * 80)



if __name__ == "__main__":
    main()
    # test()