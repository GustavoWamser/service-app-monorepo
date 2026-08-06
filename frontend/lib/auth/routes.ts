type ConfiguracaoRotaPublica = {
  quandoAutenticado: "redirecionar" | "permitir"
}

// A ordem importa pouco aqui, mas quanto mais específico o path, melhor
export const ROTAS_PUBLICAS: Record<string, ConfiguracaoRotaPublica> = {
  "/": { quandoAutenticado: "permitir" },
  "/login": { quandoAutenticado: "redirecionar" },
  "/registro": { quandoAutenticado: "redirecionar" },
  "/produtos": { quandoAutenticado: "permitir" },
}

export const ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO = "/login"
export const ROTA_REDIRECIONAMENTO_AUTENTICADO = "/dashboard"

// rotas privadas que exigem is_admin === true
export const ROTAS_SOMENTE_ADMIN = [
  "/historico",
  "/admin/produtos",
  "/admin/usuarios",
]

// Verifica se o caminho bate com alguma rota pública, considerando rotas dinâmicas
// ex: "/produtos/5" deve bater com a chave "/produtos"
export function buscarConfiguracaoRotaPublica(
  caminho: string
): ConfiguracaoRotaPublica | null {
  if (ROTAS_PUBLICAS[caminho]) {
    return ROTAS_PUBLICAS[caminho]
  }

  const chaveCorrespondente = Object.keys(ROTAS_PUBLICAS).find(
    (chave) => chave !== "/" && caminho.startsWith(`${chave}/`)
  )

  return chaveCorrespondente ? ROTAS_PUBLICAS[chaveCorrespondente] : null
}

// Mesma lógica de prefixo pras rotas somente-admin
export function ehRotaSomenteAdmin(caminho: string): boolean {
  return ROTAS_SOMENTE_ADMIN.some(
    (rota) => caminho === rota || caminho.startsWith(`${rota}/`)
  )
}