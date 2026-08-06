export default async function ProdutoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>Detalhe do Produto {id}</div>
}