"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { listarUsuarios, deletarUsuario, type UsuarioAdmin } from "@/lib/services/usuarios"
import { ErroApi } from "@/lib/services/api"

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [erro, setErro] = useState<string | null>(null)

  async function carregarUsuarios() {
    try {
      setUsuarios(await listarUsuarios())
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao carregar usuários")
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function handleDeletar(id: number) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return
    try {
      await deletarUsuario(id)
      await carregarUsuarios()
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao excluir usuário")
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Admin — Usuários</h1>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      <div className="mt-10 flex flex-col divide-y divide-black/10">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="flex items-center justify-between py-4">
            <p className="text-sm font-medium">
              {usuario.username} {usuario.is_admin && <span className="text-black/40">(admin)</span>}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/admin/usuarios/${usuario.id}`} className="text-black/60 hover:text-black">
                Editar
              </Link>
              <button onClick={() => handleDeletar(usuario.id)} className="text-red-600 hover:text-red-800">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}