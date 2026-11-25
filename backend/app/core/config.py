from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Pydantic reads each field from the environment (case-insensitive) and
    validates its type. Fields with a default value are optional.
    """

    POSTGRES_HOST: str
    postgres_user: str
    postgres_password: str
    postgres_port: int = 5432
    postgres_db: str
    jwt_secret: str
    access_token_minutes: int = 15
    refresh_tokens: int = 7
    cors_origins: list[str] = ["http://localhost:3000"]

    @property
    def database_url(self) -> str:
        """
        Build the async SQLAlchemy connection URL for PostgreSQL.

        Returns:
            str: A `postgresql+asyncpg://user:password@host:port/db` URL.
        """
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.POSTGRES_HOST}:{self.postgres_port}/{self.postgres_db}"


settings = Settings()
