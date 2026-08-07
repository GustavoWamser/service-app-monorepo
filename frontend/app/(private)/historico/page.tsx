import { listarTodasMovimentacoes } from "@/lib/services/movimentacoes"

export default async function HistoricoPage() {
  const movimentacoes = await listarTodasMovimentacoes()

  return (
    <div>
      <h1>Histórico geral de movimentações</h1>

      {movimentacoes.length === 0 && <p>Nenhuma movimentação registrada.</p>}

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Produto</th>
            <th>Usuário</th>
            <th>Quantidade</th>
            <th>Preço unitário</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => (
            <tr key={mov.id}>
              <td>{new Date(mov.criado_em).toLocaleString("pt-BR")}</td>
              <td>{mov.tipo === "venda" ? "Venda" : "Compra"}</td>
              <td>{mov.produto_nome}</td>
              <td>{mov.usuario_username}</td>
              <td>{mov.quantidade}</td>
              <td>R$ {mov.preco.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}