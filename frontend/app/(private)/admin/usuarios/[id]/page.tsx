export default async function AdminUsuarioEditarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>Editar Usuário {id}</div>
}