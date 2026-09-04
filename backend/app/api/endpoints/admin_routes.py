from fastapi import APIRouter, Depends
from app.service.admin_service import AdminService
from app.dependencies import get_admin_service
from typing import Any

router = APIRouter(prefix="/admin", tags=["Admin Routes"])

@router.get("/load")
async def handle_load_data(admin_service: AdminService = Depends(get_admin_service)) -> dict[str, Any]:
    """This route mainly loads the file data to the vector data in some manual situation"""
    return await admin_service.load_data()