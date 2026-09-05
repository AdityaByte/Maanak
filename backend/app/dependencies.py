from fastapi import Request

from app.service.query_service import QueryService
from app.service.admin_service import AdminService
from app.service.chat.chat_service import ChatService

def get_query_service(request: Request) -> QueryService:

    container = request.app.state.container
    return QueryService(
        qdrant_client= container.qdrant_client,
        retriever=container.retriever,
        context_builder=container.context_builder,
        prompt_builder=container.prompt_builder,
        llm_client=container.llm_client,
        qdrant_vector_store=container.qdrant_vector_store,
        collection_name=container.collection_name
    )

def get_admin_service(request: Request) -> AdminService:
    container = request.app.state.container
    return AdminService(vector_store=container.qdrant_vector_store)

def get_chat_service(request: Request) -> ChatService:
    container = request.app.state.container
    return ChatService(session_store=container.chat_session_store)
 