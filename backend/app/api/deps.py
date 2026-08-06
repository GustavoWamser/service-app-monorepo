from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import decodificar_token
from app.models.usuario import Usuario


def get_usuario_atual(request: Request, db: Session = Depends(get_db)) -> Usuario:
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado")

    payload = decodificar_token(token)

    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado")

    usuario = db.query(Usuario).filter(Usuario.id == int(payload["sub"])).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")

    return usuario