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
    <div>
      <h1>Login</h1>

      {registrado && <p style={{ color: "green" }}>Conta criada! Faça login.</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}