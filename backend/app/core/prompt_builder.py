from dataclasses import dataclass
from app.schema.rag_response_schema import RAGResponse

@dataclass
class PromptBuilder:

    system_template: str = (
        "You are a technical assistant answering questions about BIS (Bureau of Indian "
        "Standards) documents. Answer strictly using the provided context.\n"
        "- Cite the standard number (e.g. IS 8707) for every claim you make.\n"
        "- If the context does not contain the answer, say so explicitly — do not guess.\n"
        "- Keep answers precise; quote numeric requirements exactly as given."
    )

    no_context_fallback: str = "No relevant standards were found in the knowledge base for this query."

    structured_output_instructions: str = (
        "\n\nRespond with ONLY a JSON object matching this exact shape, no other text:\n{schema}"
    )

    # We can also provide the chat history to it but for now I'm skipping it.
    def build(self, query: str, context: str, schema_description: str) -> dict[str, any]:
        system = self.system_template + self.structured_output_instructions.format(schema=schema_description)
        user_content = self._build_user_content(query, context)
        message = {
            "role": "user",
            "content": user_content,
        }

        return {"system": system, "message": message}


    def _build_user_content(self, query: str, context: str) -> str:
        """This method just concat the context with the actual query."""
        if not context.strip():
            context = self.no_context_fallback
        return f"Context:\n{context}\n\nQuestion: {query}"
        # return query, context