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

  if (!produto) return <div>Carregando produto...</div>

  return (
    <div>
      <h1>Comprar {produto.nome}</h1>
      <p>Preço: R$ {produto.preco.toFixed(2)}</p>
      <p>Estoque disponível: {produto.quantidade}</p>
      {usuario && <p>Comprando como: {usuario.username}</p>}

      {sucesso ? (
        <div>
          <p style={{ color: "green" }}>Compra realizada com sucesso!</p>
          <button onClick={() => router.push("/produtos")}>Voltar para produtos</button>
        </div>
      ) : (
        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="number"
            min={1}
            max={produto.quantidade}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />

          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <button onClick={handleComprar} disabled={carregando || !usuario}>
            {carregando ? "Processando..." : "Confirmar compra"}
          </button>
        </div>
      )}
    </div>
  )
}