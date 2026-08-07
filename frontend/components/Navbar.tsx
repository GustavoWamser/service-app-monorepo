"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { buscarUsuarioLogado, logout, type Usuario } from "@/lib/services/auth"

export default function Navbar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregado, setCarregado] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarUsuarioLogado()
        setUsuario(dados)
      } catch {
        setUsuario(null)
      } finally {
        setCarregado(true)
      }
    }
    carregar()
  }, [pathname]) // reavalia sempre que a rota muda (ex: acabou de logar)

  async function handleLogout() {
    await logout()
    setUsuario(null)
    router.push("/produtos")
    router.refresh()
  }

  if (!carregado) return null

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link href="/produtos">Produtos</Link>

      {usuario && <Link href="/dashboard">Dashboard</Link>}

      {usuario?.is_admin && (
        <>
          <Link href="/admin/produtos">Admin Produtos</Link>
          <Link href="/admin/usuarios">Admin Usuários</Link>
          <Link href="/historico">Histórico</Link>
        </>
      )}

      <div style={{ marginLeft: "auto" }}>
        {usuario ? (
          <>
            <span>Olá, {usuario.username}</span>{" "}
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link href="/login">Entrar</Link>{" "}
            <Link href="/registro">Criar conta</Link>
          </>
        )}
      </div>
    </nav>
  )
}