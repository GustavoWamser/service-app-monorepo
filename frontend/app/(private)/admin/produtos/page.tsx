"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  listarProdutos,
  criarProduto,
  deletarProduto,
  type Produto,
} from "@/lib/services/produtos"
import { ErroApi } from "@/lib/services/api"

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function carregarProdutos() {
    const dados = await listarProdutos()
    setProdutos(dados)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await criarProduto({
        nome,
        preco: Number(preco),
        quantidade: Number(quantidade),
      })
      setNome("")
      setPreco("")
      setQuantidade("")
      await carregarProdutos()
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao criar produto")
    } finally {
      setCarregando(false)
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      await deletarProduto(id)
      await carregarProdutos()
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao excluir produto")
    }
  }

  return (
    <div>
      <h1>Admin — Produtos</h1>

      <h2>Novo produto</h2>
      <form onSubmit={handleCriar}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade inicial</label>
          <input
            id="quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Criando..." : "Criar produto"}
        </button>
      </form>

      <h2>Produtos cadastrados</h2>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} — R$ {produto.preco.toFixed(2)} (estoque: {produto.quantidade})
            {" "}
            <Link href={`/admin/produtos/${produto.id}`}>Editar</Link>
            {" "}
            <button onClick={() => handleDeletar(produto.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}