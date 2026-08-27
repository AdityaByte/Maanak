from app.schema.rag_response_schema import RAGResponse


class QueryService:

    def __init__(self, retriever, context_builder, prompt_builder, llm_client):
        self.retriever = retriever
        self.context_builder = context_builder
        self.prompt_builder = prompt_builder
        self.llm_client = llm_client

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