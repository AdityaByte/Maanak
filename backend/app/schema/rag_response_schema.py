"""
  - context_builder.py and llm_service.py all reference
    this shape. Keeping it separate means the schema can evolve (add a
    field, tighten a constraint) without hunting through every file that
    produces or consumes an answer.
"""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Confidence(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class Citation(BaseModel):
    """Citation is mainly used for describing why this standard is used."""
    standard_number: str = Field(..., description="e.g. 'IS_8707'")
    relevance: str = Field(..., description="Why this standard was used, in a few words")


class RAGResponse(BaseModel):
    answer: str = Field(..., description="The answer text, written for the end user")
    citations: List[Citation] = Field(
        default_factory=list,
        description="Standards actually relied on to produce the answer (not just retrieved)",
    )
    confidence: Confidence = Field(
        default=Confidence.medium,
        description="Model's own assessment of how well the context supported the answer",
    )
    limitations: Optional[str] = Field(
        default=None,
        description="Set when the context was incomplete, ambiguous, or didn't fully answer the question",
    )

    @classmethod
    def json_schema_for_prompt(cls) -> str:
        """A compact schema description to embed in the LLM prompt (not the full JSON Schema dump)."""
        return (
            '{\n'
            '  "answer": "string",\n'
            '  "citations": [{"standard_number": "string", "relevance": "string"}],\n'
            '  "confidence": "high" | "medium" | "low",\n'
            '  "limitations": "string or null"\n'
            '}'
        )