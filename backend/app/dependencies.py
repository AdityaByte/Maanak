from fastapi import Request

from app.service.query_service import QueryService
from app.service.admin_service import AdminService

def get_query_service(request: Request) -> QueryService:

    container = request.app.state.container
    return QueryService(
        retriever=container.retriever,
        context_builder=container.context_builder,
        prompt_builder=container.prompt_builder,
        llm_client=container.llm_client
    )

def get_admin_service(request: Request) -> AdminService:
    container = request.app.state.container
    return AdminService(vector_store=container.qdrant_vector_store)