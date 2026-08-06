"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

type Produto = {
  id: number
  nome: string
  preco: number
  quantidade: number
}

type Usuario = {
  id: number
  username: string
  is_admin: boolean
}

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
      const [respostaProduto, respostaUsuario] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${produtoId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { credentials: "include" }),
      ])

      if (respostaProduto.ok) setProduto(await respostaProduto.json())
      if (respostaUsuario.ok) setUsuario(await respostaUsuario.json())
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
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movimentacoes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          produto_id: produtoId,
          usuario_id: usuario.id,
          tipo: "venda",
          quantidade,
        }),
      })

      if (!resposta.ok) {
        const dados = await resposta.json()
        setErro(dados.detail ?? "Erro ao registrar compra")
        return
      }

      setSucesso(true)
    } catch {
      setErro("Não foi possível conectar à API")
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