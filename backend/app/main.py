from fastapi import FastAPI
from app.routes.authentication import router as user_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.users import router as users_profile_router
from app.core.config import settings
from app.routes import post



app = FastAPI()
app.include_router(user_router, prefix='/api/auth')
app.include_router(users_profile_router)
app.include_router(post.router)
app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.front_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)


@app.get('/')
async def helloWorld ( ) :
        return {"hello" : "world"}