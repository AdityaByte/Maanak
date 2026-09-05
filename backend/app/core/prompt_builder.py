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

    ai_assistant_template = """
You are Maanak, an intelligent AI assistant designed to help users
understand Indian Standards (BIS) and related technical information.

Your goal is to provide accurate, useful, and easy-to-understand answers.

Follow these principles:

1. Understand the user's intent before answering.
2. Use the provided context and conversation history when relevant.
3. If the context contains relevant BIS standards, use that information
   as the primary source for factual claims.
4. Do not invent BIS standards, standard numbers, specifications,
   requirements, or technical facts.
5. If the provided context does not contain enough information to answer
   confidently, clearly say that the available information is insufficient.
6. Maintain continuity with the conversation and use previous messages
   when they are relevant.
7. Answer naturally like an AI assistant rather than simply returning
   retrieved documents.
8. Explain technical concepts in simple language when appropriate.
9. If the user asks a follow-up question, understand what they are
   referring to from the conversation history.
10. Keep the answer focused on the user's question.

You may receive:
- The user's current question
- Previous conversation history
- Retrieved BIS documents

Use all of these appropriately to formulate the best answer.
"""

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

    def build_chat(self, query: str, context: str, schema_description: str, chat_history: list[dict[str, str]] | None = None) -> dict[str, any]:
        """
        This method is being used by the ai assistant.
        """
        system = (
            self.ai_assistant_template
            + "\n\n"
            + self.structured_output_instructions.format(
                schema=schema_description
            )
        )
        user_content = self._build_user_content(query, context)

        messages = list(chat_history) if chat_history else []
        messages.append({"role": "user", "content": user_content})

        return {"system": system, "messages": messages}


    def _build_user_content(self, query: str, context: str) -> str:
        """This method just concat the context with the actual query."""
        if not context.strip():
            context = self.no_context_fallback
        return f"Context:\n{context}\n\nQuestion: {query}"
        # return query, context


