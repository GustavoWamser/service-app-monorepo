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
  }, [pathname])

  async function handleLogout() {
    await logout()
    setUsuario(null)
    router.push("/produtos")
    router.refresh()
  }

  if (!carregado) return <div className="h-14 border-b border-black/10" />

  return (
    <nav className="sticky top-0 z-50 flex items-center gap-8 border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur-md">
      <Link href="/produtos" className="text-sm font-medium tracking-tight">
        Loja
      </Link>

      <div className="flex items-center gap-6 text-sm text-black/70">
        <Link href="/produtos" className="transition-colors hover:text-black">
          Produtos
        </Link>

        {usuario && (
          <Link href="/dashboard" className="transition-colors hover:text-black">
            Dashboard
          </Link>
        )}

        {usuario?.is_admin && (
          <>
            <Link href="/admin/produtos" className="transition-colors hover:text-black">
              Admin Produtos
            </Link>
            <Link href="/admin/usuarios" className="transition-colors hover:text-black">
              Admin Usuários
            </Link>
            <Link href="/historico" className="transition-colors hover:text-black">
              Histórico
            </Link>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4 text-sm">
        {usuario ? (
          <>
            <span className="text-black/60">{usuario.username}</span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 px-4 py-1.5 transition-colors hover:bg-black hover:text-white"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-black/70 transition-colors hover:text-black">
              Entrar
            </Link>
            <Link
              href="/registro"
              className="rounded-full bg-black px-4 py-1.5 text-white transition-colors hover:bg-black/80"
            >
              Criar conta
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}