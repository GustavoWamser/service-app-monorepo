from fastapi import Depends, HTTPException, status
from app.core.security import decodificar_token

def get_usuario_atual(token: str = Depends(oauth2_scheme)):
    usuario = decodificar_token(token)
    if not usuario:
        raise HTTPException(status_code=401, detail="Não autenticado")
    return usuario

def get_admin_atual(usuario = Depends(get_usuario_atual)):
    if not usuario.is_admin:
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores")
    return usuario