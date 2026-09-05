from fastapi import APIRouter, Depends
from app.schema.chat_schema import ChatRequest, ChatResponseModel
from app.service.chat.chat_service import ChatService
from app.dependencies import get_chat_service

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponseModel)
def chat(request: ChatRequest, chat_service: ChatService = Depends(get_chat_service)):
    session_id, response = chat_service.send_message(request.session_id, request.message)
    return ChatResponseModel(
        session_id=session_id,
        answer=response.answer,
        citations=response.citations,
        confidence=response.confidence,
        limitations=response.limitations
    )