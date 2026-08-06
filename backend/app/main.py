from fastapi import FastAPI
from app.database.base import Base
from app.database.session import engine
from app.models import usuario, produto, movimentacao
from app.api import produtos, usuarios, movimentacoes

app = FastAPI(title="Loja Apple API")

Base.metadata.create_all(bind=engine)

app.include_router(produtos.router)
app.include_router(usuarios.router)
app.include_router(movimentacoes.router)


@app.get("/")
def root():
    return {"status": "API rodando"}