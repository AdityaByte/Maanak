from app.schema.rag_response_schema import RAGResponse
from app.core.qdrant_vector_store import QdrantVectorStore
from app.core.llm.groq_llm_client import GroqLLMClient
from app.core.prompt_builder import PromptBuilder
from app.core.context_builder import ContextBuilder
from app.core.retriever.retriever import HybridRetriever
from app.schema.standard_response import StandardResponse
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

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

    async def handle_standards(self, category: str | None = None) -> list[StandardResponse]:
        """Return all standards or standards belonging to a specific category."""

        scroll_filter = None
        if category:
            scroll_filter = Filter(
                must=[
                    FieldCondition(
                        key="category",
                        match=MatchValue(value=category)
                    )
                ]
            )

        results, _ = self.qdrant_client.scroll(
            collection_name=self.collection_name,
            scroll_filter=scroll_filter,
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