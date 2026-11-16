from pydantic_settings import BaseSettings

class Settings ( BaseSettings ):
    POSTGRES_HOST: str
    postgres_user: str
    postgres_password: str
    postgres_port: int = 5432
    postgres_db: str = "postgresDB"


    @property
    def database_url ( self ) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.POSTGRES_HOST}:{self.postgres_port}/{self.postgres_db}"


settings = Settings()