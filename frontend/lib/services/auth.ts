import { apiFetch } from "./api"

export type Usuario = {
  id: number
  username: string
  is_admin: boolean
}

export function login(username: string, senha: string) {
  return apiFetch<Usuario>("/auth/login", {
    method: "POST",
    body: { username, senha },
  })
}

export function registrar(username: string, senha: string) {
  return apiFetch<{ id: number; username: string; is_admin: boolean }>("/usuarios/", {
    method: "POST",
    body: { username, senha, is_admin: false },
  })
}

export function buscarUsuarioLogado() {
  return apiFetch<Usuario>("/auth/me")
}

export function logout() {
  return apiFetch<{ detail: string }>("/auth/logout", { method: "POST" })
}