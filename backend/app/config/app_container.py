from app.core.embedding_manager import EmbeddingManager
from app.core.retriever.retriever import HybridRetriever
from app.core.qdrant_vector_store import QdrantVectorStore
from app.core.retriever.query_router import QueryRouter
from app.core.context_builder import ContextBuilder
from app.core.prompt_builder import PromptBuilder
from app.core.llm.groq_llm_client import GroqLLMClient
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
import os
import logging

logger = logging.getLogger(__name__)


class AppContainer:

    def __init__(self):
        self.embedding_manager: EmbeddingManager | None = None
        self.qdrant_client: QdrantClient | None = None
        self.qdrant_vector_store: QdrantVectorStore | None = None
        self.query_router: QueryRouter | None = None
        self.retriever: HybridRetriever | None = None
        self.context_builder: ContextBuilder | None = None
        self.prompt_builder: PromptBuilder | None = None
        self.llm_client: GroqLLMClient | None = None
        self.collection_name: str | None = None

    def initialize(self):
        self.embedding_manager = EmbeddingManager()
        self.qdrant_client = self.init_qdrant_client()

        dense_dim = self.embedding_manager.get_embeddings_dimesion()

        collection_name: str = os.getenv("QDRANT_COLLECTION_NAME") or "bis_standards"
        if collection_name == "":
            logger.error(f"Failed to load the environment variable for collection name.")
            exit(1)

        self.collection_name = collection_name

        # Making sure that the collection exists.
        self._create_collection(collection_name, dense_dim)

        self.qdrant_vector_store = QdrantVectorStore(
            collection_name="bis_standards",
            dense_dim=dense_dim,
            embed_fn=self.embedding_manager.generate_embeddings,
            client=self.qdrant_client
        )

        categories = self.qdrant_vector_store.get_categories()

        self.query_router = QueryRouter(known_categories=categories)

        self.retriever = HybridRetriever(
            client=self.qdrant_client,
            collection_name=collection_name,
            embed_fn=self.embedding_manager.generate_embeddings,
            router=self.query_router
        )

        self.context_builder = ContextBuilder()
        self.prompt_builder = PromptBuilder()
        self.llm_client = GroqLLMClient()


    def _create_collection(self, collection_name: str, dense_dim: int) -> None:
        if self.qdrant_client.collection_exists(collection_name):
            logger.info(f"Qdrant collection {collection_name} already exists.")
            return
        logger.info(f"Creating qdrant collection: {collection_name}")
        self.qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config = {
                    # we are using dense for semantic vector.
                    "dense": VectorParams(
                        size=dense_dim,
                        distance=Distance.COSINE
                    )
                }
        )
        logger.info(f"Qdrant Collection {collection_name} created successfully.")

    @classmethod
    def init_qdrant_client(cls) -> QdrantClient:
        url = os.getenv("QDRANT_SERVER_URL")
        api_key = os.getenv("QDRANT_API_KEY")
        if url == "":
            logger.error(f"Failed to load the environment variable for server url.")
            exit(1)

        return QdrantClient(url=url, api_key=api_key, timeout=60)
