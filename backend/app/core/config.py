from pydantic_settings import BaseSettings

class Settings ( BaseSettings ):
    POSTGRES_HOST: str
    postgres_user: str
    postgres_password: str
    postgres_port: int = 5432
    postgres_db: str
    jwt_secret: str
    access_token_minutes: int = 15
    # Browser origins allowed to call the API with cookies.
    # Override in Secrets/.env as JSON, e.g. CORS_ORIGINS=["http://localhost:3000"]
    cors_origins: list[str] = ["http://localhost:3000"]


    @property
    def database_url ( self ) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.POSTGRES_HOST}:{self.postgres_port}/{self.postgres_db}"


settings = Settings()