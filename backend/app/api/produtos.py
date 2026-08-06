from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse
from app.services import produto_service

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.post("/", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    return produto_service.criar_produto(db, dados)


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    return produto_service.listar_produtos(db)


@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = produto_service.buscar_produto_por_id(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto


@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(produto_id: int, dados: ProdutoUpdate, db: Session = Depends(get_db)):
    produto = produto_service.atualizar_produto(db, produto_id, dados)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    sucesso = produto_service.deletar_produto(db, produto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Produto não encontrado")