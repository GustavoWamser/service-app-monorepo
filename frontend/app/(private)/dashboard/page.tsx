import { listarMinhasMovimentacoes } from "@/lib/services/movimentacoes"

export default async function DashboardPage() {
  const movimentacoes = await listarMinhasMovimentacoes()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-black/50">Suas movimentações</p>

      {movimentacoes.length === 0 && (
        <p className="mt-12 text-black/40">Você ainda não fez nenhuma movimentação.</p>
      )}

      <div className="mt-10 flex flex-col divide-y divide-black/10">
        {movimentacoes.map((mov) => (
          <div key={mov.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">
                {mov.tipo === "venda" ? "Compra realizada" : "Reposição de estoque"}
              </p>
              <p className="text-xs text-black/40">
                {new Date(mov.criado_em).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <p className="text-sm text-black/60">
              {mov.quantidade}x — R$ {mov.preco.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}