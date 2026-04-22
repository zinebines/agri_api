from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/agri_db"
    APP_NAME: str = "Agri API"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
