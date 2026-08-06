type PayloadJWT = {
  sub: string
  is_admin: boolean
  exp: number
}

// Decodifica o payload sem validar assinatura (só pra leitura de claims, ex: is_admin)
export function decodificarJWT(token: string): PayloadJWT | null {
  try {
    const payloadBase64 = token.split(".")[1]
    const payloadJson = atob(payloadBase64)
    return JSON.parse(payloadJson) as PayloadJWT
  } catch {
    return null
  }
}

export function tokenExpirado(payload: PayloadJWT): boolean {
  const agora = Math.floor(Date.now() / 1000)
  return payload.exp < agora
}

export async function renovarToken(refreshToken: string): Promise<string | null> {
  try {
    const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!resposta.ok) return null

    const dados = await resposta.json()
    return dados.access_token as string
  } catch {
    return null
  }
}