"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { buscarProduto, type Produto } from "@/lib/services/produtos"
import { buscarUsuarioLogado, type Usuario } from "@/lib/services/auth"
import { criarMovimentacao } from "@/lib/services/movimentacoes"
import { ErroApi } from "@/lib/services/api"

export default function ComprarProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const produtoId = Number(params.id)

  const [produto, setProduto] = useState<Produto | null>(null)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [quantidade, setQuantidade] = useState(1)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosProduto, dadosUsuario] = await Promise.all([
          buscarProduto(produtoId),
          buscarUsuarioLogado(),
        ])
        setProduto(dadosProduto)
        setUsuario(dadosUsuario)
      } catch (err) {
        setErro(err instanceof ErroApi ? err.message : "Erro ao carregar dados")
      }
    }
    carregarDados()
  }, [produtoId])

  async function handleComprar() {
    if (!usuario) {
      setErro("Não foi possível identificar o usuário logado")
      return
    }

    setErro(null)
    setCarregando(true)

    try {
      await criarMovimentacao({
        produto_id: produtoId,
        usuario_id: usuario.id,
        tipo: "venda",
        quantidade,
      })
      setSucesso(true)
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  if (!produto) return <div className="p-16 text-center text-black/40">Carregando produto...</div>

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{produto.nome}</h1>
      <p className="mt-2 text-3xl font-semibold">R$ {produto.preco.toFixed(2)}</p>
      <p className="mt-1 text-sm text-black/40">Estoque disponível: {produto.quantidade}</p>
      {usuario && <p className="mt-1 text-sm text-black/40">Comprando como: {usuario.username}</p>}

      {sucesso ? (
        <div className="mt-8 rounded-2xl border border-black/10 p-6 text-center">
          <p className="font-medium">Compra realizada com sucesso!</p>
          <button
            onClick={() => router.push("/produtos")}
            className="mt-4 rounded-full bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-black/80"
          >
            Voltar para produtos
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="quantidade" className="text-sm text-black/60">Quantidade</label>
            <input
              id="quantidade"
              type="number"
              min={1}
              max={produto.quantidade}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            onClick={handleComprar}
            disabled={carregando || !usuario}
            className="rounded-full bg-black py-2.5 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
          >
            {carregando ? "Processando..." : "Confirmar compra"}
          </button>
        </div>
      )}
    </main>
  )
}