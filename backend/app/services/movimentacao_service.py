from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.movimentacao import Movimentacao, TipoMovimentacao
from app.models.produto import Produto
from app.models.usuario import Usuario as UsuarioModel
from app.schemas.movimentacao import MovimentacaoCreate, MovimentacaoDetalhadaResponse

def criar_movimentacao(db: Session, dados: MovimentacaoCreate) -> Movimentacao:
    produto = db.query(Produto).filter(Produto.id == dados.produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    preco_usado = dados.preco if dados.preco is not None else produto.preco

    if dados.tipo == TipoMovimentacao.venda:
        if produto.quantidade < dados.quantidade:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente. Disponível: {produto.quantidade}",
            )
        produto.quantidade -= dados.quantidade

    elif dados.tipo == TipoMovimentacao.compra:
        produto.quantidade += dados.quantidade

    movimentacao = Movimentacao(
        produto_id=dados.produto_id,
        usuario_id=dados.usuario_id,
        tipo=dados.tipo,
        preco=preco_usado,
        quantidade=dados.quantidade,
    )

    db.add(movimentacao)
    db.add(produto)
    db.commit()
    db.refresh(movimentacao)
    return movimentacao

def listar_movimentacoes(db: Session) -> list[Movimentacao]:
    return db.query(Movimentacao).all()

def buscar_movimentacao_por_id(db: Session, movimentacao_id: int) -> Movimentacao | None:
    return db.query(Movimentacao).filter(Movimentacao.id == movimentacao_id).first()

def listar_movimentacoes_por_produto(db: Session, produto_id: int) -> list[Movimentacao]:
    return db.query(Movimentacao).filter(Movimentacao.produto_id == produto_id).all()

def listar_movimentacoes_por_usuario(db: Session, usuario_id: int) -> list[Movimentacao]:
    return db.query(Movimentacao).filter(Movimentacao.usuario_id == usuario_id).all()

def listar_movimentacoes_detalhadas(db: Session) -> list[MovimentacaoDetalhadaResponse]:
    movimentacoes = (
        db.query(Movimentacao)
        .join(Produto, Movimentacao.produto_id == Produto.id)
        .join(UsuarioModel, Movimentacao.usuario_id == UsuarioModel.id)
        .all()
    )

    resultado = []
    for mov in movimentacoes:
        resultado.append(
            MovimentacaoDetalhadaResponse(
                id=mov.id,
                produto_id=mov.produto_id,
                usuario_id=mov.usuario_id,
                tipo=mov.tipo,
                preco=mov.preco,
                quantidade=mov.quantidade,
                criado_em=mov.criado_em,
                produto_nome=mov.produto.nome,
                usuario_username=mov.usuario.username,
            )
        )
    return resultado