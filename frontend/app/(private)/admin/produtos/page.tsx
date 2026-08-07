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
    setProdutos(await listarProdutos())
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await criarProduto({ nome, preco: Number(preco), quantidade: Number(quantidade) })
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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Admin — Produtos</h1>

      <form onSubmit={handleCriar} className="mt-10 flex flex-wrap items-end gap-4 rounded-2xl border border-black/10 p-6">
        <div className="flex-1 min-w-[160px]">
          <label className="text-sm text-black/60">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="w-28">
          <label className="text-sm text-black/60">Preço</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="w-28">
          <label className="text-sm text-black/60">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="rounded-full bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
        >
          {carregando ? "Criando..." : "Criar"}
        </button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      <div className="mt-10 flex flex-col divide-y divide-black/10">
        {produtos.map((produto) => (
          <div key={produto.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">{produto.nome}</p>
              <p className="text-xs text-black/40">
                R$ {produto.preco.toFixed(2)} — estoque: {produto.quantidade}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/admin/produtos/${produto.id}`} className="text-black/60 hover:text-black">
                Editar
              </Link>
              <button onClick={() => handleDeletar(produto.id)} className="text-red-600 hover:text-red-800">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}