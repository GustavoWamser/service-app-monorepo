export default async function AdminProdutoEditarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>Editar Produto {id}</div>
}