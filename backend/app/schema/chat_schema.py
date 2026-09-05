from pydantic import BaseModel
from app.schema.rag_response_schema import Citation

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None   # omit on the first message of a new conversation


class ChatResponseModel(BaseModel):
    session_id: str
    answer: str
    citations: list[Citation]
    confidence: str
    limitations: str | None = None