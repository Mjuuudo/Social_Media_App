from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.

    Every model inherits from it, so `Base.metadata` holds all tables
    (Alembic uses it to generate migrations).
    """

    pass
