import Link from "next/link"

type Produto = {
  id: number
  nome: string
  preco: number
  quantidade: number
  criado_em: string
}

async function buscarProdutos(): Promise<Produto[]> {
  const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/`, {
    cache: "no-store",
  })

  if (!resposta.ok) {
    throw new Error("Erro ao buscar produtos")
  }

  return resposta.json()
}

export default async function ProdutosPage() {
  const produtos = await buscarProdutos()

  return (
    <div>
      <h1>Produtos</h1>

      {produtos.length === 0 && <p>Nenhum produto cadastrado ainda.</p>}

      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            <strong>{produto.nome}</strong> — R$ {produto.preco.toFixed(2)}
            {" "}(estoque: {produto.quantidade})
            {" "}
            <Link href={`/produtos/${produto.id}/comprar`}>Comprar</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}