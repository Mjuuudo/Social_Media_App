from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    POSTGRES_USER:str
    POSTGRES_DB: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST : str ="database"
    POSTGRES_PORT: int =5432
    
    model_config = SettingsConfigDict(env_file="../Secrets/.env", extra="ignore")
    
    @property 
    def database_url(self)->str:
         return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings=Settings()
        
    