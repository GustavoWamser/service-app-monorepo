export default async function ComprarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>Comprar Produto {id}</div>
}