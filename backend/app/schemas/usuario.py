from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UsuarioBase(BaseModel):
    username: str


class UsuarioCreate(UsuarioBase):
    senha: str
    is_admin: bool = False


class UsuarioUpdate(BaseModel):
    username: str | None = None
    senha: str | None = None
    is_admin: bool | None = None


class UsuarioResponse(UsuarioBase):
    id: int
    is_admin: bool
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)