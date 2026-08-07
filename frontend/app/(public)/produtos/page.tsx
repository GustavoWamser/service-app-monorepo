import Link from "next/link"
import { listarProdutos } from "@/lib/services/produtos"

export default async function ProdutosPage() {
  const produtos = await listarProdutos()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Produtos</h1>
      <p className="mt-2 text-black/50">Explore nossa seleção.</p>

      {produtos.length === 0 && (
        <p className="mt-12 text-black/40">Nenhum produto cadastrado ainda.</p>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="group rounded-2xl border border-black/10 p-6 transition-shadow hover:shadow-lg"
          >
            <h2 className="text-lg font-medium">{produto.nome}</h2>
            <p className="mt-1 text-2xl font-semibold">R$ {produto.preco.toFixed(2)}</p>
            <p className="mt-1 text-sm text-black/40">Estoque: {produto.quantidade}</p>

            <Link
              href={`/produtos/${produto.id}/comprar`}
              className="mt-6 inline-block w-full rounded-full bg-black py-2 text-center text-sm text-white transition-colors hover:bg-black/80"
            >
              Comprar
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}