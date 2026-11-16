from app.schemas.user import RegisterRequest, loginModel
from app.core.security import hashPassword, verify_password
from app.models.user import UserModel
from app.repository.user import save_user, get_by_email, get_by_username
from sqlalchemy.ext.asyncio import AsyncSession


from fastapi import HTTPException




async def register_client( 
        data : RegisterRequest,
        session: AsyncSession
          ) :
    hashed_password = hashPassword(data.password)

    if await get_by_username(session, data.username) :
        raise HTTPException(status_code = 409, detail='Username Already Exists')
    if await get_by_email(session, data.email) :
        raise HTTPException(status_code = 409, detail='Email Already Exists In Our records')


    new_user = UserModel(
        username = data.username,
        first_name = data.first_name,
        last_name = data.last_name,
        email = data.email,
        password_hash = hashed_password,  
    )

    return await save_user(session, new_user)


async def login_client( data: loginModel ,
                        session: AsyncSession
                        ):
    user = await get_by_email(session, data.email)

    if not user :
        raise HTTPException( status_code=401, detail='User Not Found In Our records')

    if not verify_password(user.password_hash, data.password) :
        raise HTTPException( status_code = 401, detail='Credentials Are Not Correct')

    return user
    

    
