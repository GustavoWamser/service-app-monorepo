import { listarTodasMovimentacoes } from "@/lib/services/movimentacoes"

export default async function HistoricoPage() {
  const movimentacoes = await listarTodasMovimentacoes()

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Histórico geral</h1>

      {movimentacoes.length === 0 && (
        <p className="mt-12 text-black/40">Nenhuma movimentação registrada.</p>
      )}

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-black/40">
              <th className="py-3 font-normal">Data</th>
              <th className="py-3 font-normal">Tipo</th>
              <th className="py-3 font-normal">Produto</th>
              <th className="py-3 font-normal">Usuário</th>
              <th className="py-3 font-normal">Qtd</th>
              <th className="py-3 font-normal">Preço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {movimentacoes.map((mov) => (
              <tr key={mov.id}>
                <td className="py-3">{new Date(mov.criado_em).toLocaleString("pt-BR")}</td>
                <td className="py-3">{mov.tipo === "venda" ? "Venda" : "Compra"}</td>
                <td className="py-3">{mov.produto_nome}</td>
                <td className="py-3">{mov.usuario_username}</td>
                <td className="py-3">{mov.quantidade}</td>
                <td className="py-3">R$ {mov.preco.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}