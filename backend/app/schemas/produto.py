from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ProdutoBase(BaseModel):
    nome: str
    preco: float
    quantidade: int


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome: str | None = None
    preco: float | None = None
    quantidade: int | None = None


class ProdutoResponse(ProdutoBase):
    id: int
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)