from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = create_async_engine(settings.database_url)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    """
    FastAPI dependency that provides a database session for one request.

    Opens a new `AsyncSession`, yields it to the route, and closes it
    automatically when the request is finished. FastAPI reuses the same
    session for every dependency within a single request.

    Yields:
        AsyncSession: An open SQLAlchemy async session.
    """
    async with SessionLocal() as session:
        yield session
