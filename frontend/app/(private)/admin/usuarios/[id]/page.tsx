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
        ...(senha ? { senha } : {}),
      })
      router.push("/admin/usuarios")
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Erro ao atualizar usuário")
    } finally {
      setCarregando(false)
    }
  }

  if (!carregado) return <div className="p-16 text-center text-black/40">Carregando...</div>

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Editar usuário</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm text-black/60">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm text-black/60">Nova senha (deixe em branco pra manter)</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-black/60">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4"
          />
          É admin
        </label>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-black py-2.5 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
        >
          {carregando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </main>
  )
}