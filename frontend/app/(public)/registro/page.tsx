"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, senha, is_admin: false }),
      })

      if (!resposta.ok) {
        const dados = await resposta.json()
        setErro(dados.detail ?? "Erro ao criar conta")
        return
      }

      // conta criada, manda pro login com um aviso de sucesso
      router.push("/login?registrado=true")
    } catch {
      setErro("Não foi possível conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <h1>Criar conta</h1>

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

        <div>
          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p>
        Já tem conta? <a href="/login">Entrar</a>
      </p>
    </div>
  )
}