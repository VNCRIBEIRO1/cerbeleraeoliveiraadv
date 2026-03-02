// ============================================================
// WEBHOOK — Google Calendar Push Notifications
// Recebe notificações em tempo real quando eventos são alterados
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sincronizarDoGoogle } from '@/lib/google-calendar'

export async function POST(request: NextRequest) {
  try {
    // Headers da notificação Google
    const channelId = request.headers.get('x-goog-channel-id')
    const resourceState = request.headers.get('x-goog-resource-state')
    const channelToken = request.headers.get('x-goog-channel-token') // userId

    // Mensagem sync inicial — apenas confirmar
    if (resourceState === 'sync') {
      console.log(`[Webhook] Sync confirmado para canal ${channelId}`)
      return NextResponse.json({ ok: true })
    }

    // Notificação de mudança — resourceState === 'exists'
    if (resourceState === 'exists' && channelToken) {
      const userId = channelToken

      // Verificar se o usuário existe e tem sync ativo
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          googleSyncAtivo: true,
          googleRefreshToken: true,
          googleChannelId: true,
        },
      })

      if (!user?.googleSyncAtivo || !user.googleRefreshToken) {
        return NextResponse.json({ ok: true })
      }

      // Verificar se o canal é válido
      if (user.googleChannelId !== channelId) {
        console.log(`[Webhook] Canal ${channelId} não pertence ao usuário ${userId}`)
        return NextResponse.json({ ok: true })
      }

      // Sincronizar o mês atual e o próximo (para cobrir eventos recentes)
      const agora = new Date()
      const mesAtual = agora.getMonth() + 1
      const anoAtual = agora.getFullYear()

      console.log(`[Webhook] Sincronizando para usuário ${userId} — ${mesAtual}/${anoAtual}`)

      // Sync do mês atual
      const resultado = await sincronizarDoGoogle(userId, mesAtual, anoAtual)
      console.log(`[Webhook] Resultado sync: importados=${resultado.importados}, atualizados=${resultado.atualizados}, cancelados=${resultado.cancelados}`)

      // Se estiver no final do mês, sincronizar o próximo também
      const diasNoMes = new Date(anoAtual, mesAtual, 0).getDate()
      if (agora.getDate() >= diasNoMes - 3) {
        const proxMes = mesAtual === 12 ? 1 : mesAtual + 1
        const proxAno = mesAtual === 12 ? anoAtual + 1 : anoAtual
        await sincronizarDoGoogle(userId, proxMes, proxAno)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook] Erro ao processar notificação:', error)
    // Retornar 200 mesmo em caso de erro para evitar retries infinitos
    return NextResponse.json({ ok: true })
  }
}

// Google exige que o endpoint aceite GET também (verificação)
export async function GET() {
  return NextResponse.json({ status: 'webhook ativo' })
}
