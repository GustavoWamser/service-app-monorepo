import { apiFetch } from "./api"

export type UsuarioAdmin = {
  id: number
  username: string
  is_admin: boolean
  criado_em: string
}

export type UsuarioUpdateInput = {
  username?: string
  senha?: string
  is_admin?: boolean
}

export function listarUsuarios() {
  return apiFetch<UsuarioAdmin[]>("/usuarios/")
}

export function buscarUsuario(id: number) {
  return apiFetch<UsuarioAdmin>(`/usuarios/${id}`)
}

export function atualizarUsuario(id: number, dados: UsuarioUpdateInput) {
  return apiFetch<UsuarioAdmin>(`/usuarios/${id}`, { method: "PUT", body: dados })
}

export function deletarUsuario(id: number) {
  return apiFetch<void>(`/usuarios/${id}`, { method: "DELETE" })
}