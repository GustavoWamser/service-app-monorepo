"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { buscarProduto, atualizarProduto } from "@/lib/services/produtos"
import { ErroApi } from "@/lib/services/api"

export default function EditarProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const produtoId = Number(params.id)

  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    async function carregar() {
      const produto = await buscarProduto(produtoId)
      setNome(produto.nome)
      setPreco(String(produto.preco))
      setQuantidade(String(produto.quantidade))
      setCarregado(true)
    }
    carregar()
  }, [produtoId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await atualizarProduto(produtoId, { nome, preco: Number(preco), quantidade: Number(quantidade) })
      router.push("/admin/produtos")
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao atualizar produto")
    } finally {
      setCarregando(false)
    }
  }

  if (!carregado) return <div className="p-16 text-center text-black/40">Carregando...</div>

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Editar produto</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm text-black/60">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm text-black/60">Preço</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm text-black/60">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-black py-2.5 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
        >
          {carregando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </main>
  )
}