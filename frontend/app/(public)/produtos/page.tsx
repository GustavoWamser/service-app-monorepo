import Link from "next/link"
import { listarProdutos } from "@/lib/services/produtos"

export default async function ProdutosPage() {
  const produtos = await listarProdutos()

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