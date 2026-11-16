from app.schemas.user import RegisterRequest
from app.core.security import hashPassword
from app.models.user import UserModel
from app.repository.user import save_user
from sqlalchemy.ext.asyncio import AsyncSession



async def register_client( 
        data : RegisterRequest,
        session: AsyncSession
          ) :
    hashed_password = hashPassword(data.password)

    new_user = UserModel(
        username = data.username,
        first_name = data.first_name,
        last_name = data.last_name,
        email = data.email,
        password_hash = hashed_password,  
    )

    return await save_user(session, new_user)
