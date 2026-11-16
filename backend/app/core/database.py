from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from collections.abc import AsyncIterator


engine = create_async_engine( settings.database_url )
SessionLocal = async_sessionmaker( engine, expire_on_commit=False )

async def get_session( ) -> AsyncIterator[AsyncSession]:
    async with SessionLocal( ) as session :
        yield session