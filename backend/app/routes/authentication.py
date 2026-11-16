from fastapi import APIRouter , Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import RegisterRequest, RegisterResponse, loginModel
from app.core.database import get_session

from app.services.authentication import register_client, login_client
from app.core.security import create_access_token
from app.core.config import settings


router = APIRouter( tags=['Authentication'])

@router.post('/signup', status_code = 201 )
async def signup( 
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session)
) :
    user = await register_client(data, session)

    return user


@router.post( '/signin', status_code = 200, response_model=RegisterResponse )
async def signin (
    data: loginModel,
    response: Response,
    session: AsyncSession = Depends(get_session)    ) :

    user = await login_client(data, session)
    token = create_access_token(user.id)

    response.set_cookie(
        key = "access_token",
        value = token,
        httponly = True,
        samesite = "lax",
        secure = False,
        max_age =  settings.access_token_minutes * 60
    )
    return user

