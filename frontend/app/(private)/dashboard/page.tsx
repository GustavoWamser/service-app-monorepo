import { listarMinhasMovimentacoes } from "@/lib/services/movimentacoes"

export default async function DashboardPage() {
  const movimentacoes = await listarMinhasMovimentacoes()

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Minhas movimentações</h2>

      {movimentacoes.length === 0 && <p>Você ainda não fez nenhuma movimentação.</p>}

      <ul>
        {movimentacoes.map((mov) => (
          <li key={mov.id}>
            {mov.tipo === "venda" ? "Compra realizada" : "Reposição de estoque"}
            {" — "}
            {mov.quantidade}x por R$ {mov.preco.toFixed(2)} cada
            {" ("}
            {new Date(mov.criado_em).toLocaleDateString("pt-BR")}
            {")"}
          </li>
        ))}
      </ul>
    </div>
  )
}