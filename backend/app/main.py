# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.session import engine
from app.models import usuario, produto, movimentacao
from app.api import produtos, usuarios, movimentacoes, auth

app = FastAPI(title="Loja Apple API")

# CORS — logo depois de criar o app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(produtos.router)
app.include_router(usuarios.router)
app.include_router(movimentacoes.router)


@app.get("/")
def root():
    return {"status": "API rodando"}