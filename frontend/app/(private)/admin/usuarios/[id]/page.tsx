"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { buscarUsuario, atualizarUsuario } from "@/lib/services/usuarios"
import { ErroApi } from "@/lib/services/api"

export default function EditarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const usuarioId = Number(params.id)

  const [username, setUsername] = useState("")
  const [senha, setSenha] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    async function carregar() {
      const usuario = await buscarUsuario(usuarioId)
      setUsername(usuario.username)
      setIsAdmin(usuario.is_admin)
      setCarregado(true)
    }
    carregar()
  }, [usuarioId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await atualizarUsuario(usuarioId, {
        username,
        is_admin: isAdmin,
        ...(senha ? { senha } : {}),   // só manda senha se o campo foi preenchido
      })
      router.push("/admin/usuarios")
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao atualizar usuário")
    } finally {
      setCarregando(false)
    }
  }

  if (!carregado) return <div>Carregando...</div>

  return (
    <div>
      <h1>Editar usuário</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="senha">Nova senha (deixe em branco pra manter)</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            {" "}É admin
          </label>
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  )
}