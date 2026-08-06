from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.movimentacao import TipoMovimentacao


class MovimentacaoCreate(BaseModel):
    produto_id: int
    usuario_id: int
    tipo: TipoMovimentacao
    quantidade: int
    preco: float | None = None  # se não vier, usamos o preço atual do produto


class MovimentacaoResponse(BaseModel):
    id: int
    produto_id: int
    usuario_id: int
    tipo: TipoMovimentacao
    preco: float
    quantidade: int
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)