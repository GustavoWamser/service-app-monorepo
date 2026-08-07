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
      const dados = await listarUsuarios()
      setUsuarios(dados)
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
    <div>
      <h1>Admin — Usuários</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.username} {usuario.is_admin && "(admin)"}
            {" "}
            <Link href={`/admin/usuarios/${usuario.id}`}>Editar</Link>
            {" "}
            <button onClick={() => handleDeletar(usuario.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}