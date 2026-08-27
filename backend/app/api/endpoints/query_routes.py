"""It contains the routes for handling the BIS queries."""
from fastapi import APIRouter, HTTPException, Depends
from http import HTTPStatus
from app.schema.rag_response_schema import RAGResponse
from app.schema.query_schema import QueryRequest
from app.dependencies import get_query_service
from app.service.query_service import QueryService

router = APIRouter(prefix="/query", tags=["Query Routes"])

@router.post("/", response_model=RAGResponse)
async def query_handler(request: QueryRequest, query_service: QueryService = Depends(get_query_service)):

    if request.query.strip() == "":
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="No query found in the request.")

    return await query_service.handle_query(request.query)