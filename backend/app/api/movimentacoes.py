from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_usuario_atual, get_admin_atual
from app.models.usuario import Usuario
from app.database.session import get_db
from app.schemas.movimentacao import (
    MovimentacaoCreate,
    MovimentacaoResponse,
    MovimentacaoDetalhadaResponse,
)
from app.services import movimentacao_service

router = APIRouter(prefix="/movimentacoes", tags=["Movimentacoes"])


@router.post("/", response_model=MovimentacaoResponse, status_code=201)
def criar_movimentacao(dados: MovimentacaoCreate, db: Session = Depends(get_db)):
    return movimentacao_service.criar_movimentacao(db, dados)


@router.get("/", response_model=list[MovimentacaoDetalhadaResponse])
def listar_movimentacoes(
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_admin_atual),
):
    return movimentacao_service.listar_movimentacoes_detalhadas(db)


@router.get("/minhas", response_model=list[MovimentacaoResponse])
def listar_minhas_movimentacoes(
    usuario: Usuario = Depends(get_usuario_atual),
    db: Session = Depends(get_db),
):
    return movimentacao_service.listar_movimentacoes_por_usuario(db, usuario.id)


@router.get("/{movimentacao_id}", response_model=MovimentacaoResponse)
def buscar_movimentacao(movimentacao_id: int, db: Session = Depends(get_db)):
    movimentacao = movimentacao_service.buscar_movimentacao_por_id(db, movimentacao_id)
    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")
    return movimentacao


@router.get("/produto/{produto_id}", response_model=list[MovimentacaoResponse])
def listar_por_produto(produto_id: int, db: Session = Depends(get_db)):
    return movimentacao_service.listar_movimentacoes_por_produto(db, produto_id)