const API_URL = process.env.NEXT_PUBLIC_API_URL

type OpcoesRequisicao = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
}

export class ErroApi extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function apiFetch<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  // No servidor (Server Component), repassa os cookies manualmente.
  // Import dinâmico evita que "next/headers" entre no bundle do navegador.
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    headers["Cookie"] = cookieStore.toString()
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: opcoes.method ?? "GET",
    headers,
    credentials: "include",
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
    cache: "no-store",
  })

  if (!resposta.ok) {
    const dados = await resposta.json().catch(() => ({}))
    throw new ErroApi(dados.detail ?? "Erro na requisição", resposta.status)
  }

  if (resposta.status === 204) {
    return undefined as T
  }

  return resposta.json()
}