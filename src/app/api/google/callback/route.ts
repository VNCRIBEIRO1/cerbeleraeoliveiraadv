// ============================================================
// API: /api/google/callback — Callback OAuth do Google
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exchangeCodeForTokens, registrarWebhook } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // userId
    const error = searchParams.get('error')

    // Redirecionar para configurações com status
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || ''
    const configUrl = `${baseUrl}/painel/configuracoes`

    if (error) {
      return NextResponse.redirect(`${configUrl}?google=erro&motivo=${error}`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${configUrl}?google=erro&motivo=parametros_ausentes`)
    }

    // Trocar code por tokens
    const tokens = await exchangeCodeForTokens(code)

    if (!tokens.access_token) {
      return NextResponse.redirect(`${configUrl}?google=erro&motivo=token_invalido`)
    }

    // Salvar tokens no usuário
    await prisma.user.update({
      where: { id: state },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || undefined,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        googleSyncAtivo: true,
      },
    })

    // Registrar webhook para notificações em tempo real
    try {
      await registrarWebhook(state)
    } catch (webhookError) {
      console.error('Erro ao registrar webhook (não crítico):', webhookError)
    }

    return NextResponse.redirect(`${configUrl}?google=sucesso`)
  } catch (error) {
    console.error('Erro no callback Google:', error)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || ''
    return NextResponse.redirect(`${baseUrl}/painel/configuracoes?google=erro&motivo=interno`)
  }
}
