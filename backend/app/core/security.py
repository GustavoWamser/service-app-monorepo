from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
import bcrypt

from app.core.config import settings


def gerar_hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha_plana.encode(), senha_hash.encode())


def criar_token(dados: dict, expira_em: timedelta) -> str:
    to_encode = dados.copy()
    expira = datetime.now(timezone.utc) + expira_em
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def criar_access_token(usuario_id: int, username: str, is_admin: bool) -> str:
    return criar_token(
        {"sub": str(usuario_id), "username": username, "is_admin": is_admin},
        timedelta(minutes=settings.access_token_expire_minutes),
    )


def criar_refresh_token(usuario_id: int) -> str:
    return criar_token(
        {"sub": str(usuario_id), "type": "refresh"},
        timedelta(days=settings.refresh_token_expire_days),
    )


def decodificar_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None