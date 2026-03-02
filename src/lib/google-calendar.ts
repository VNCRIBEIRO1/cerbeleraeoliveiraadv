// ============================================================
// INTEGRAÇÃO GOOGLE CALENDAR — Cerbelera & Oliveira Advogados
// Sync bidirecional completo: CMS ↔ Google Calendar
// ============================================================
import { google, calendar_v3 } from 'googleapis'
import { prisma } from './prisma'
import { v4 as uuidv4 } from 'uuid'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

function getOAuth2Client() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim()
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim()
  const redirectUri = `${siteUrl}/api/google/callback`

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não configurados')
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

// Gerar URL de autorização OAuth
export function getAuthUrl(userId: string): string {
  const client = getOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId,
  })
}

// Trocar code por tokens
export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client()
  const { tokens } = await client.getToken(code)
  return tokens
}

// Obter client autenticado do usuário
export async function getAuthenticatedClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  })

  if (!user?.googleRefreshToken) {
    throw new Error('Usuário não conectou o Google Calendar')
  }

  const client = getOAuth2Client()
  client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry?.getTime(),
  })

  // Listener para atualizar tokens quando renovados
  client.on('tokens', async (tokens) => {
    const updateData: Record<string, unknown> = {}
    if (tokens.access_token) updateData.googleAccessToken = tokens.access_token
    if (tokens.expiry_date) updateData.googleTokenExpiry = new Date(tokens.expiry_date)
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updateData })
    }
  })

  return { client, calendarId: 'primary' }
}

// ============================================================
// OPERAÇÕES COM EVENTOS
// ============================================================

interface EventoData {
  titulo: string
  descricao?: string | null
  dataHora: Date
  duracao: number // minutos
  local?: string | null
  tipo?: string
  clienteNome?: string | null
}

// Criar evento no Google Calendar
export async function criarEventoGoogle(userId: string, evento: EventoData): Promise<string | null> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const inicio = new Date(evento.dataHora)
    const fim = new Date(inicio.getTime() + evento.duracao * 60000)

    const descricaoCompleta = [
      evento.descricao,
      evento.clienteNome ? `Cliente: ${evento.clienteNome}` : null,
      evento.tipo ? `Tipo: ${evento.tipo}` : null,
      '---',
      'Cerbelera & Oliveira Advogados Associados',
    ].filter(Boolean).join('\n')

    const res = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: evento.titulo,
        description: descricaoCompleta,
        location: evento.local || undefined,
        start: {
          dateTime: inicio.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: fim.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'popup', minutes: 60 * 24 },
          ],
        },
        colorId: getTipoColorId(evento.tipo),
      },
    })

    return res.data.id || null
  } catch (error) {
    console.error('Erro ao criar evento Google:', error)
    return null
  }
}

// Atualizar evento no Google Calendar
export async function atualizarEventoGoogle(
  userId: string,
  googleEventId: string,
  evento: Partial<EventoData>
): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const updateBody: Record<string, unknown> = {}
    if (evento.titulo) updateBody.summary = evento.titulo
    if (evento.descricao !== undefined) updateBody.description = evento.descricao
    if (evento.local !== undefined) updateBody.location = evento.local

    if (evento.dataHora) {
      const inicio = new Date(evento.dataHora)
      const fim = new Date(inicio.getTime() + (evento.duracao || 60) * 60000)
      updateBody.start = { dateTime: inicio.toISOString(), timeZone: 'America/Sao_Paulo' }
      updateBody.end = { dateTime: fim.toISOString(), timeZone: 'America/Sao_Paulo' }
    }

    await calendar.events.update({
      calendarId,
      eventId: googleEventId,
      requestBody: updateBody,
    })

    return true
  } catch (error) {
    console.error('Erro ao atualizar evento Google:', error)
    return false
  }
}

// Deletar evento do Google Calendar
export async function deletarEventoGoogle(userId: string, googleEventId: string): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    await calendar.events.delete({ calendarId, eventId: googleEventId })
    return true
  } catch (error) {
    console.error('Erro ao deletar evento Google:', error)
    return false
  }
}

// Buscar eventos do Google Calendar em um período (com suporte a showDeleted)
export async function buscarEventosGoogle(
  userId: string,
  inicio: Date,
  fim: Date,
  opcoes?: { showDeleted?: boolean }
) {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const allEvents: calendar_v3.Schema$Event[] = []
    let pageToken: string | undefined = undefined

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await calendar.events.list({
        calendarId,
        timeMin: inicio.toISOString(),
        timeMax: fim.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
        showDeleted: opcoes?.showDeleted || false,
        pageToken,
      })

      if (res.data.items) {
        allEvents.push(...res.data.items)
      }
      pageToken = res.data.nextPageToken || undefined
    } while (pageToken)

    return allEvents
  } catch (error) {
    console.error('Erro ao buscar eventos Google:', error)
    return []
  }
}

// Sincronizar: exportar agendamentos locais → Google
export async function sincronizarParaGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      googleEventId: null,
      dataHora: { gte: inicio, lte: fim },
      status: { not: 'cancelado' },
    },
    include: {
      cliente: { select: { nome: true } },
    },
  })

  let criados = 0
  for (const ag of agendamentos) {
    const eventId = await criarEventoGoogle(userId, {
      titulo: ag.titulo,
      descricao: ag.descricao,
      dataHora: ag.dataHora,
      duracao: ag.duracao,
      local: ag.local,
      tipo: ag.tipo,
      clienteNome: ag.cliente?.nome,
    })

    if (eventId) {
      await prisma.agendamento.update({
        where: { id: ag.id },
        data: { googleEventId: eventId },
      })
      criados++
    }
  }

  return { criados, total: agendamentos.length }
}

// ============================================================
// SINCRONIZAÇÃO BIDIRECIONAL COMPLETA: Google → Local
// Detecta: novos eventos, modificações, cancelamentos, deleções
// ============================================================
export async function sincronizarDoGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  // Buscar eventos incluindo deletados/cancelados
  const eventosGoogle = await buscarEventosGoogle(userId, inicio, fim, { showDeleted: true })

  // Buscar TODOS agendamentos locais do período que têm googleEventId
  const agendamentosLocais = await prisma.agendamento.findMany({
    where: {
      googleEventId: { not: null },
      dataHora: { gte: inicio, lte: fim },
    },
    select: {
      id: true,
      googleEventId: true,
      titulo: true,
      descricao: true,
      dataHora: true,
      duracao: true,
      local: true,
      status: true,
      tipo: true,
    },
  })

  // Criar mapa de agendamentos locais por googleEventId
  const mapaLocal = new Map(agendamentosLocais.map(a => [a.googleEventId!, a]))

  // Todos os googleEventIds que existem no Google (incluindo cancelados)
  const idsNoGoogle = new Set<string>()

  let importados = 0
  let atualizados = 0
  let cancelados = 0

  for (const evento of eventosGoogle) {
    if (!evento.id) continue
    idsNoGoogle.add(evento.id)

    const agLocal = mapaLocal.get(evento.id)

    // ── CASO 1: Evento cancelado/deletado no Google ──
    if (evento.status === 'cancelled') {
      if (agLocal && agLocal.status !== 'cancelado') {
        await prisma.agendamento.update({
          where: { id: agLocal.id },
          data: { status: 'cancelado' },
        })
        cancelados++
      }
      continue
    }

    // ── CASO 2: Evento já existe localmente → verificar modificações ──
    if (agLocal) {
      const dataInicio = evento.start?.dateTime || evento.start?.date
      if (!dataInicio) continue

      const dataFim = evento.end?.dateTime || evento.end?.date
      const googleInicio = new Date(dataInicio)
      const googleFim = dataFim ? new Date(dataFim) : new Date(googleInicio.getTime() + 3600000)
      const googleDuracao = Math.round((googleFim.getTime() - googleInicio.getTime()) / 60000)

      // Comparar campos para detectar alterações
      const tituloMudou = (evento.summary || 'Evento Google') !== agLocal.titulo
      const dataMudou = Math.abs(googleInicio.getTime() - agLocal.dataHora.getTime()) > 60000 // >1min
      const duracaoMudou = googleDuracao !== agLocal.duracao
      const localMudou = (evento.location || null) !== (agLocal.local || null)

      if (tituloMudou || dataMudou || duracaoMudou || localMudou) {
        const updateData: Record<string, unknown> = {}
        if (tituloMudou) updateData.titulo = evento.summary || 'Evento Google'
        if (dataMudou) updateData.dataHora = googleInicio
        if (duracaoMudou) updateData.duracao = googleDuracao > 0 ? googleDuracao : 60
        if (localMudou) updateData.local = evento.location || null

        // Reclassificar tipo se título mudou
        if (tituloMudou) {
          updateData.tipo = classificarTipoEvento(evento.summary || '')
        }

        await prisma.agendamento.update({
          where: { id: agLocal.id },
          data: updateData,
        })
        atualizados++
      }
      continue
    }

    // ── CASO 3: Evento novo no Google → importar ──
    const dataInicio = evento.start?.dateTime || evento.start?.date
    if (!dataInicio) continue

    const dataFim = evento.end?.dateTime || evento.end?.date
    const inicio2 = new Date(dataInicio)
    const fim2 = dataFim ? new Date(dataFim) : new Date(inicio2.getTime() + 3600000)
    const duracao = Math.round((fim2.getTime() - inicio2.getTime()) / 60000)

    await prisma.agendamento.create({
      data: {
        titulo: evento.summary || 'Evento Google',
        descricao: evento.description || null,
        dataHora: inicio2,
        duracao: duracao > 0 ? duracao : 60,
        tipo: classificarTipoEvento(evento.summary || ''),
        status: 'agendado',
        local: evento.location || null,
        googleEventId: evento.id,
      },
    })
    importados++
  }

  // ── CASO 4: Eventos locais com googleEventId que NÃO existem mais no Google ──
  // (deletados permanentemente do Google, não apenas cancelados)
  for (const agLocal of agendamentosLocais) {
    if (agLocal.googleEventId && !idsNoGoogle.has(agLocal.googleEventId) && agLocal.status !== 'cancelado') {
      await prisma.agendamento.update({
        where: { id: agLocal.id },
        data: { status: 'cancelado' },
      })
      cancelados++
    }
  }

  return { importados, atualizados, cancelados }
}

// ============================================================
// WEBHOOK — Push Notifications do Google Calendar
// ============================================================

// Registrar canal de webhook para receber notificações em tempo real
export async function registrarWebhook(userId: string): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim()
    if (!siteUrl || siteUrl.includes('localhost')) {
      console.log('Webhook não registrado: URL não é HTTPS público')
      return false
    }

    const channelId = uuidv4()
    // Expira em 7 dias (máximo recomendado pelo Google)
    const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000

    const res = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: `${siteUrl}/api/google/webhook`,
        token: userId, // identificar o usuário
        expiration: expiration.toString(),
      },
    })

    // Salvar dados do canal no banco
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleChannelId: channelId,
        googleResourceId: res.data.resourceId || null,
        googleChannelExpiry: new Date(expiration),
      },
    })

    console.log(`Webhook registrado para usuário ${userId}, canal ${channelId}`)
    return true
  } catch (error) {
    console.error('Erro ao registrar webhook Google:', error)
    return false
  }
}

// Parar canal de webhook
export async function pararWebhook(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { googleChannelId: true, googleResourceId: true },
    })

    if (!user?.googleChannelId || !user?.googleResourceId) return false

    const { client } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    await calendar.channels.stop({
      requestBody: {
        id: user.googleChannelId,
        resourceId: user.googleResourceId,
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleChannelId: null,
        googleResourceId: null,
        googleChannelExpiry: null,
      },
    })

    return true
  } catch (error) {
    console.error('Erro ao parar webhook:', error)
    return false
  }
}

// Renovar webhook se estiver próximo da expiração
export async function renovarWebhookSeNecessario(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { googleChannelExpiry: true, googleSyncAtivo: true },
  })

  if (!user?.googleSyncAtivo) return

  const agora = new Date()
  const umDiaAntes = user?.googleChannelExpiry
    ? new Date(user.googleChannelExpiry.getTime() - 24 * 60 * 60 * 1000)
    : null

  // Se não tem canal ou está perto de expirar, renovar
  if (!user?.googleChannelExpiry || (umDiaAntes && agora >= umDiaAntes)) {
    // Parar canal anterior se existir
    try { await pararWebhook(userId) } catch { /* silencioso */ }
    await registrarWebhook(userId)
  }
}

// ============================================================
// HELPERS
// ============================================================

function getTipoColorId(tipo?: string): string {
  switch (tipo) {
    case 'audiencia': return '11'
    case 'prazo': return '6'
    case 'reuniao': return '7'
    case 'consulta': return '2'
    case 'retorno': return '5'
    default: return '1'
  }
}

function classificarTipoEvento(titulo: string): string {
  const t = titulo.toLowerCase()
  if (t.includes('audiência') || t.includes('audiencia')) return 'audiencia'
  if (t.includes('prazo')) return 'prazo'
  if (t.includes('reunião') || t.includes('reuniao')) return 'reuniao'
  if (t.includes('consulta')) return 'consulta'
  if (t.includes('retorno')) return 'retorno'
  return 'consulta'
}
