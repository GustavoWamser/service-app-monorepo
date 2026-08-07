import { apiFetch } from "./api"

export type Produto = {
  id: number
  nome: string
  preco: number
  quantidade: number
  criado_em: string
}

export type ProdutoInput = {
  nome: string
  preco: number
  quantidade: number
}

export function listarProdutos() {
  return apiFetch<Produto[]>("/produtos/")
}

export function buscarProduto(id: number) {
  return apiFetch<Produto>(`/produtos/${id}`)
}

export function criarProduto(dados: ProdutoInput) {
  return apiFetch<Produto>("/produtos/", { method: "POST", body: dados })
}

export function atualizarProduto(id: number, dados: Partial<ProdutoInput>) {
  return apiFetch<Produto>(`/produtos/${id}`, { method: "PUT", body: dados })
}

export function deletarProduto(id: number) {
  return apiFetch<void>(`/produtos/${id}`, { method: "DELETE" })
}