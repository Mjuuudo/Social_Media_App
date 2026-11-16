from fastapi import APIRouter , Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import RegisterRequest, RegisterResponse
from app.core.database import get_session

from app.services.authentication import register_client

router = APIRouter( tags=['Authentication'])

@router.post('/', status_code = 201 )
async def create_user( 
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session)
) :
    user = await register_client(data, session)

    return user
