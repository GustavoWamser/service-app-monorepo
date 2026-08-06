from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.services import usuario_service

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def criar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    existente = usuario_service.buscar_usuario_por_username(db, dados.username)
    if existente:
        raise HTTPException(status_code=400, detail="Username já está em uso")
    return usuario_service.criar_usuario(db, dados)


@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    return usuario_service.listar_usuarios(db)


@router.get("/{usuario_id}", response_model=UsuarioResponse)
def buscar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = usuario_service.buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


@router.put("/{usuario_id}", response_model=UsuarioResponse)
def atualizar_usuario(usuario_id: int, dados: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = usuario_service.atualizar_usuario(db, usuario_id, dados)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    sucesso = usuario_service.deletar_usuario(db, usuario_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")