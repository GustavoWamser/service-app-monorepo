from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Loja Apple API"
    database_url: str
    secret_key: str = "chave-simples-para-teste"

    class Config:
        env_file = ".env"

settings = Settings()