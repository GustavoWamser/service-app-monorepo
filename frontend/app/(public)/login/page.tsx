"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/lib/services/auth"
import { ErroApi } from "@/lib/services/api"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registrado = searchParams.get("registrado") === "true"

  const [username, setUsername] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await login(username, senha)
      router.push("/produtos")
      router.refresh()
    } catch (err) {
      setErro(err instanceof ErroApi ? err.message : "Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>

      {registrado && (
        <p className="mt-3 rounded-lg bg-black/5 px-4 py-2 text-sm text-black/70">
          Conta criada! Faça login.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="text-sm text-black/60">Username</label>
          <input
            id="username"
            type="text"
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

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded-full bg-black py-2.5 text-sm text-white transition-colors hover:bg-black/80 disabled:opacity-40"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-black/50">
        Não tem conta?{" "}
        <a href="/registro" className="text-black underline">Criar conta</a>
      </p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-black/40">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}