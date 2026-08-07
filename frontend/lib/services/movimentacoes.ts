import { apiFetch } from "./api"

export function listarMinhasMovimentacoes() {
  return apiFetch<Movimentacao[]>("/movimentacoes/minhas")
}

export type Movimentacao = {
  id: number
  produto_id: number
  usuario_id: number
  tipo: "compra" | "venda"
  preco: number
  quantidade: number
  criado_em: string
}

export type MovimentacaoInput = {
  produto_id: number
  usuario_id: number
  tipo: "compra" | "venda"
  quantidade: number
}

export function criarMovimentacao(dados: MovimentacaoInput) {
  return apiFetch<Movimentacao>("/movimentacoes/", { method: "POST", body: dados })
}

export function listarMovimentacoes() {
  return apiFetch<Movimentacao[]>("/movimentacoes/")
}

export type MovimentacaoDetalhada = Movimentacao & {
  produto_nome: string
  usuario_username: string
}

export function listarTodasMovimentacoes() {
  return apiFetch<MovimentacaoDetalhada[]>("/movimentacoes/")
}