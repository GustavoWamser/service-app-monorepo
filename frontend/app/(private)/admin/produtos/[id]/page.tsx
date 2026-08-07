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
      await atualizarProduto(produtoId, {
        nome,
        preco: Number(preco),
        quantidade: Number(quantidade),
      })
      router.push("/admin/produtos")
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao atualizar produto")
    } finally {
      setCarregando(false)
    }
  }

  if (!carregado) return <div>Carregando...</div>

  return (
    <div>
      <h1>Editar produto</h1>

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="quantidade">Quantidade</label>
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
          {carregando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  )
}