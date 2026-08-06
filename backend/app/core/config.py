from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Loja Apple API"
    database_url: str
    secret_key: str = "chave-simples-para-teste"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"

settings = Settings()