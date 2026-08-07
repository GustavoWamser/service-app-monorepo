"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registrar } from "@/lib/services/auth"
import { ErroApi } from "@/lib/services/api"

export default function RegistroPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem")
      return
    }

    setCarregando(true)

    try {
      await registrar(username, senha)
      router.push("/login?registrado=true")
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Criar conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="text-sm text-black/60">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="senha" className="text-sm text-black/60">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="text-sm text-black/60">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-black py-2.5 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
        >
          {carregando ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-black/50">
        Já tem conta?{" "}
        <a href="/login" className="text-black underline">Entrar</a>
      </p>
    </main>
  )
}