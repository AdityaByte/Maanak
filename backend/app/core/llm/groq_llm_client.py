from dataclasses import dataclass
from app.core.llm.llm_client import LLMClient
from langchain_groq import ChatGroq
import os
from typing import Type, TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel) # Using the TypeVar for making it more genric.

@dataclass
class GroqLLMClient(LLMClient):
    model: str = "openai/gpt-oss-120b"
    temperature: float = 0.1
    max_tokens: int = 1024
    api_key: str | None = None
    _llm: ChatGroq | None = None


    def __post_init__(self):
        """This method is for post initialization."""
        self.api_key = self.api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not set")

        self._llm = ChatGroq(
            model=self.model,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            api_key=self.api_key
        )

    def complete(self, prompt: dict[str, any], schema: Type[T]) -> T:

        if not self._llm:
            raise ValueError("ChatGroq object is not created.")

        messages = [
            ("system", prompt["system"]),
            ("human", prompt["message"]["content"])
        ]

        response = self._llm.with_structured_output(schema).invoke(messages)
        return response