from typing import Type, TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class LLMClient:
    """Interface for the LLM clients which ever client we are using in the future"""
    def complete(self, prompt: dict[str, any], schema: Type[T]) -> T:
        raise NotImplementedError

    def complete_chat(self, prompt: dict[str, any], schema: Type[T]) -> T:
        raise NotImplementedError