type ConfiguracaoRotaPublica = {
  quandoAutenticado: "redirecionar" | "permitir"
}

export const ROTAS_PUBLICAS: Record<string, ConfiguracaoRotaPublica> = {
  "/": { quandoAutenticado: "permitir" },
  "/login": { quandoAutenticado: "redirecionar" },
  "/registro": { quandoAutenticado: "redirecionar" },
  "/produtos": { quandoAutenticado: "permitir" },
}

export const ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO = "/registro"  
export const ROTA_REDIRECIONAMENTO_AUTENTICADO = "/produtos" 

export const ROTAS_SOMENTE_ADMIN = [
  "/historico",
  "/admin/produtos",
  "/admin/usuarios",
]

const SUFIXOS_PRIVADOS = ["/comprar"]

export function buscarConfiguracaoRotaPublica(
  caminho: string
): ConfiguracaoRotaPublica | null {
  if (SUFIXOS_PRIVADOS.some((sufixo) => caminho.endsWith(sufixo))) {
    return null
  }

  if (ROTAS_PUBLICAS[caminho]) {
    return ROTAS_PUBLICAS[caminho]
  }

  const chaveCorrespondente = Object.keys(ROTAS_PUBLICAS).find(
    (chave) => chave !== "/" && caminho.startsWith(`${chave}/`)
  )

  return chaveCorrespondente ? ROTAS_PUBLICAS[chaveCorrespondente] : null
}

export function ehRotaSomenteAdmin(caminho: string): boolean {
  return ROTAS_SOMENTE_ADMIN.some(
    (rota) => caminho === rota || caminho.startsWith(`${rota}/`)
  )
}