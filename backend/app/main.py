from fastapi import FastAPI
from app.routes.authentication import router as user_router
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI()
app.include_router(user_router, prefix='/api/auth')

app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)


@app.get('/')
async def helloWorld ( ) :
        return {"hello" : "world"}