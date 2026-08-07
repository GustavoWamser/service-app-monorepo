from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
from app.core.security import gerar_hash_senha


def criar_usuario(db: Session, dados: UsuarioCreate) -> Usuario:
    usuario = Usuario(
        username=dados.username,
        senha_hash=gerar_hash_senha(dados.senha),
        is_admin=dados.is_admin,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def listar_usuarios(db: Session) -> list[Usuario]:
    return db.query(Usuario).all()


def buscar_usuario_por_id(db: Session, usuario_id: int) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()


def buscar_usuario_por_username(db: Session, username: str) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.username == username).first()


def atualizar_usuario(db: Session, usuario_id: int, dados: UsuarioUpdate) -> Usuario | None:
    usuario = buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return None

    dados_atualizados = dados.model_dump(exclude_unset=True)

    if "senha" in dados_atualizados:
        senha = dados_atualizados.pop("senha")
        usuario.senha_hash = gerar_hash_senha(senha)

    for campo, valor in dados_atualizados.items():
        setattr(usuario, campo, valor)

    db.commit()
    db.refresh(usuario)
    return usuario


def deletar_usuario(db: Session, usuario_id: int) -> bool:
    usuario = buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return False

    db.delete(usuario)
    db.commit()
    return True