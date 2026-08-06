from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest
from app.services import auth_service
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(dados: LoginRequest, response: Response, db: Session = Depends(get_db)):
    usuario = auth_service.autenticar_usuario(db, dados.username, dados.senha)
    access_token, refresh_token = auth_service.gerar_tokens(usuario)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )

    return {
        "id": usuario.id,
        "username": usuario.username,
        "is_admin": usuario.is_admin,
    }


@router.post("/refresh")
def refresh(dados: RefreshRequest, response: Response, db: Session = Depends(get_db)):
    novo_access_token = auth_service.renovar_access_token(db, dados.refresh_token)

    response.set_cookie(
        key="access_token",
        value=novo_access_token,
        httponly=True,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )

    return {"access_token": novo_access_token}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "Logout realizado"}