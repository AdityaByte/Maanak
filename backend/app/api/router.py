from fastapi import APIRouter

from app.api.endpoints import health_routes, admin_routes, query_routes

api_router = APIRouter()

routes = [
    health_routes.router,
    admin_routes.router,
    query_routes.router
]

for route in routes:
    api_router.include_router(route)