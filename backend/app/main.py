from fastapi import FastAPI
from app.routes.authentication import router as user_router

app = FastAPI()
app.include_router(user_router, prefix='/api/auth')


@app.get('/')
async def helloWorld ( ) :
        return {"hello" : "world"}