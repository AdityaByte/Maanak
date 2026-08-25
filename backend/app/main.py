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

setup_logging()

def main():
    doc_loader = JSONDocumentLoader("data/food_standards_dataset.jsonl")
    result = doc_loader.load()

    if not result:
        raise ValueError("Failed to create the document struture")

    # Once the documents has been loaded successfully.
    # We need to create a EmbeddingManager Object.
    embedding_manager = EmbeddingManager()
    page_contents = [doc.page_content for doc in result]
    embeddings = embedding_manager.generate_embeddings(texts=page_contents)
    print(type(embeddings))
    print(embeddings[0])


if __name__ == "__main__":
    main()