from dataclasses import dataclass

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

    # We can also provide the chat history to it but for now I'm skipping it.
    def build(self, query: str, context: str) -> dict[str, any]:
        user_content = self._build_user_content(query, context)
        message = {
            "role": "user",
            "content": user_content,
        }

        return {"system": self.system_template, "message": message}


    def _build_user_content(self, query: str, context: str) -> str:
        """This method just concat the context with the actual query."""
        if not context.strip():
            context = self.no_context_fallback
        return f"Context:\n{context}\n\nQuestion: {query}"
        # return query, context