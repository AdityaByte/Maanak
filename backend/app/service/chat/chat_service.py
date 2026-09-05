from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from app.schema.rag_response_schema import RAGResponse


@dataclass
class ChatSession:
    retriever: Any
    context_builder: Any
    prompt_builder: Any
    llm_client: Any
    top_k: int = 5
    max_history_turns: int = 8
    history: list[dict[str, str]] = field(default_factory=list)

    def send(self, user_message: str) -> dict[str, Any]:
        documents = self.retriever.retrieve(user_message, top_k=self.top_k)
        context = self.context_builder.build(documents)

        prompt = self.prompt_builder.build_chat(
            query=user_message,
            context=context,
            schema_description=RAGResponse.json_schema_for_prompt(),
            chat_history=self.history,
        )

        response: RAGResponse = self.llm_client.complete_chat(prompt, schema=RAGResponse)

        self.history.append({"role": "user", "content": user_message})
        self.history.append({"role": "assistant", "content": response.answer})
        self._trim_history()

        return {"response": response, "documents": documents}

    def _trim_history(self):
        max_messages = self.max_history_turns * 2
        if len(self.history) > max_messages:
            self.history = self.history[-max_messages:]


class ChatSessionStore:

    def __init__(self, retriever: Any, context_builder: Any, prompt_builder: Any, llm_client: Any):
        self._retriever = retriever
        self._context_builder = context_builder
        self._prompt_builder = prompt_builder
        self._llm_client = llm_client
        self._sessions: dict[str, ChatSession] = {}

    def get_or_create(self, session_id: str | None) -> tuple[str, ChatSession]:
        if session_id and session_id in self._sessions:
            return session_id, self._sessions[session_id]

        new_id = session_id or str(uuid.uuid4())
        session = ChatSession(
            retriever=self._retriever,
            context_builder=self._context_builder,
            prompt_builder=self._prompt_builder,
            llm_client=self._llm_client,
        )
        self._sessions[new_id] = session
        return new_id, session

    def clear(self, session_id: str) -> bool:
        return self._sessions.pop(session_id, None) is not None


@dataclass
class ChatService:
    session_store: ChatSessionStore

    def send_message(self, session_id: str | None, message: str) -> tuple[str, RAGResponse]:
        session_id, session = self.session_store.get_or_create(session_id)
        result = session.send(message)
        return session_id, result["response"]

    def end_session(self, session_id: str) -> bool:
        return self.session_store.clear(session_id)