from app.schema.rag_response_schema import RAGResponse
from app.core.qdrant_vector_store import QdrantVectorStore
from app.core.llm.groq_llm_client import GroqLLMClient
from app.core.prompt_builder import PromptBuilder
from app.core.context_builder import ContextBuilder
from app.core.retriever.retriever import HybridRetriever
from app.schema.standard_response import StandardResponse
from qdrant_client import QdrantClient

class QueryService:

    def __init__(self, qdrant_client, retriever, context_builder, prompt_builder, llm_client, qdrant_vector_store, collection_name):
        self.qdrant_client: QdrantClient = qdrant_client
        self.retriever: HybridRetriever = retriever
        self.context_builder: ContextBuilder = context_builder
        self.prompt_builder: PromptBuilder = prompt_builder
        self.llm_client: GroqLLMClient = llm_client
        self.qdrant_vector_store: QdrantVectorStore = qdrant_vector_store
        self.collection_name: str = collection_name

    async def handle_query(self, query: str) -> RAGResponse:

        results = self.retriever.retrieve(query)

        context = self.context_builder.build(results)

        schema_description = RAGResponse.json_schema_for_prompt()

        prompt = self.prompt_builder.build(
            query=query,
            context=context,
            schema_description=schema_description
        )

        response = self.llm_client.complete(
            prompt,
            RAGResponse
        )

        return response

    async def handle_categories(self) -> list[str]:
        """Return a list of categories that the vector db has."""
        return self.qdrant_vector_store.get_categories()

    async def handle_all_standards(self) -> list[StandardResponse]:
        """Return a list of all standards containing the metadata."""
        results, _ = self.qdrant_client.scroll(
            collection_name=self.collection_name,
            limit=100,
            with_payload=True,
            with_vectors=False
        )

        return [StandardResponse(
            id=point.payload["id"],
            title=point.payload["title"],
            content=point.payload['page_content'],
            category=point.payload["category"],
            sub_category=point.payload.get("subcategory"),
            year_published=point.payload.get("year_published"),
            last_amended=point.payload.get("last_amended"),
            certification_type=point.payload.get("certification_type"),
            certificate_mandatory=point.payload.get("certification_mandatory"),
        ) for point in results]