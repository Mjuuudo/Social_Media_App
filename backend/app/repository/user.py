from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import UserModel

async def get_by_email ( session: AsyncSession, email: str ) -> UserModel | None :
    query = select( UserModel ).where( UserModel.email == email) 
    result = await session.execute( query )
    return result.scalar_one_or_none()


async def get_by_username( session: AsyncSession, username: str ) -> UserModel | None :
    query = select( UserModel ).where( UserModel.username == username)
    result = await session.execute(query)
    return result.scalar_one_or_none()


async def get_by_id ( session: AsyncSession, id: int ) -> UserModel :
    query = select( UserModel ).where(UserModel.id == id )
    result = await session.execute( query )
    return result.scalar_one_or_none()

async def get_all( session: AsyncSession ) :
    query = select(UserModel)
    result = await session.execute( query )
    return result.scalars().all()

async def save_user(session: AsyncSession, user: UserModel) -> UserModel :
    session.add(user)
    await session.commit()
    return user


