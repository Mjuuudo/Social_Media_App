from fastapi import Depends, Cookie, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.security import decode_access_token
from app.repository.user import get_by_id
from app.models.user import UserModel



async def get_current_user ( 
        access_token: str | None = Cookie(default=None),
        session: AsyncSession = Depends(get_session)
) -> UserModel:
    if access_token is None :
        raise HTTPException(status_code=401, detail='Token Not Provided')

    user_id = decode_access_token(access_token)
    if user_id is None :
        raise HTTPException(status_code=401, detail='Invalid Token')

    user = await get_by_id(session, user_id)
    if user is None :
        raise HTTPException(status_code=401, detail='Id Provided In The Token Is Invalid')

    return user