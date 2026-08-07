import { NextRequest, NextResponse } from "next/server"
import {
  buscarConfiguracaoRotaPublica,
  ehRotaSomenteAdmin,
  ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO,
  ROTA_REDIRECIONAMENTO_AUTENTICADO,
} from "@/lib/auth/routes"
import { decodificarJWT, tokenExpirado, renovarToken } from "@/lib/auth/jwt"

export async function middleware(request: NextRequest) {
  const enderecoCompleto = request.nextUrl.pathname
  console.log("MIDDLEWARE RODOU PARA:", enderecoCompleto)

  const tokenCookie = request.cookies.get("access_token")
  const estaAutenticado = Boolean(tokenCookie?.value)

  const configuracaoRotaPublica = buscarConfiguracaoRotaPublica(enderecoCompleto)

  // --- Caso 1: rota pública ---
  if (configuracaoRotaPublica) {
    if (estaAutenticado && configuracaoRotaPublica.quandoAutenticado === "redirecionar") {
      return NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_AUTENTICADO, request.url))
    }
    return NextResponse.next()
  }

  // --- Caso 2: rota privada, sem cookie de auth ---
  if (!estaAutenticado) {
    return NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO, request.url))
  }

  // --- Caso 3: rota privada, com cookie — decodifica o JWT ---
  let payload = decodificarJWT(tokenCookie!.value)

  if (!payload) {
    // token corrompido/ilegível, trata como não autenticado
    const resposta = NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO, request.url))
    resposta.cookies.delete("access_token")
    return resposta
  }

  // --- Caso 4: token expirado -> tenta refresh ---
  if (tokenExpirado(payload)) {
    const refreshTokenCookie = request.cookies.get("refresh_token")

    if (!refreshTokenCookie?.value) {
      return NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO, request.url))
    }

    const novoToken = await renovarToken(refreshTokenCookie.value)

    if (!novoToken) {
      const resposta = NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_NAO_AUTENTICADO, request.url))
      resposta.cookies.delete("access_token")
      resposta.cookies.delete("refresh_token")
      return resposta
    }

    payload = decodificarJWT(novoToken)

    if (ehRotaSomenteAdmin(enderecoCompleto) && !payload?.is_admin) {
      return NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_AUTENTICADO, request.url))
    }

    const resposta = NextResponse.next()
    resposta.cookies.set("access_token", novoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    return resposta
  }

  // --- Caso 5: rota exige admin ---
  if (ehRotaSomenteAdmin(enderecoCompleto) && !payload.is_admin) {
    return NextResponse.redirect(new URL(ROTA_REDIRECIONAMENTO_AUTENTICADO, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}