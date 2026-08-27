from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.app_container import AppContainer
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
import dotenv
from app.config.logger import setup_logging

dotenv.load_dotenv(".env.dev")
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    container = AppContainer()
    container.initialize()

    app.state.container = container
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)