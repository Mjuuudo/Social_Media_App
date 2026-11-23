from fastapi import APIRouter , Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import RegisterRequest, RegisterResponse, loginModel, UserResponse
from app.core.database import get_session

from app.services.authentication import register_client, login_client
from app.core.security import create_access_token
from app.core.config import settings
from app.repository.user import get_all 
from app.models.user import UserModel
from app.dependencies import get_current_user


router = APIRouter( tags=['Authentication'] )

@router.post( '/signup', status_code = 201 )
async def signup( 
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session)
) :
    user = await register_client(data, session)

    return user


@router.post( '/signin', status_code = 200 )
async def signin (
    data: loginModel,
    response: Response,
    session: AsyncSession = Depends(get_session)    ) :

    print(data)
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

@router.get('/all', status_code = 200, response_model = list[UserResponse])
async def list_all(
    session: AsyncSession = Depends(get_session)
 ) :
    return await get_all( session )

@router.get('/me', status_code = 200, response_model = UserResponse )
async def list_me( 
    user: UserModel = Depends(get_current_user)
) :
    print("Woooooorking !!!!")
    return user


# response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)
