from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.authentication import router as user_router

app = FastAPI()
app.include_router(user_router, prefix="/api/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def helloWorld():
    """
    Health-check endpoint.

    Used to quickly verify that the API is up and reachable
    (also exercised by `tests/test_healthy.py`).

    Returns:
        dict: A static payload `{"hello": "world"}`.
    """
    return {"hello": "world"}
