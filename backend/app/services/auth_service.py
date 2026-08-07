from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.usuario import Usuario
from app.core.security import (
    verificar_senha,
    criar_access_token,
    criar_refresh_token,
    decodificar_token,
)


def autenticar_usuario(db: Session, username: str, senha: str) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.username == username).first()

    if not usuario or not verificar_senha(senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou senha incorretos",
        )

    return usuario


def gerar_tokens(usuario: Usuario) -> tuple[str, str]:
    access_token = criar_access_token(usuario.id, usuario.username, usuario.is_admin)
    refresh_token = criar_refresh_token(usuario.id)
    return access_token, refresh_token


def renovar_access_token(db: Session, refresh_token: str) -> str:
    payload = decodificar_token(refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Refresh token inválido")

    usuario = db.query(Usuario).filter(Usuario.id == int(payload["sub"])).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return criar_access_token(usuario.id, usuario.username, usuario.is_admin)