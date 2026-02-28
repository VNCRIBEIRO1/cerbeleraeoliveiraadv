// ============================================================
// INTEGRAÇÃO GOOGLE CALENDAR — Cerbelera & Oliveira Advogados
// ============================================================
import { google } from 'googleapis'
import { prisma } from './prisma'

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
    state: userId, // identificar qual usuário está conectando
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
            { method: 'popup', minutes: 60 * 24 }, // 1 dia antes
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

// Buscar eventos do Google Calendar em um período
export async function buscarEventosGoogle(
  userId: string,
  inicio: Date,
  fim: Date
) {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const res = await calendar.events.list({
      calendarId,
      timeMin: inicio.toISOString(),
      timeMax: fim.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    })

    return res.data.items || []
  } catch (error) {
    console.error('Erro ao buscar eventos Google:', error)
    return []
  }
}

// Sincronizar: exportar agendamentos locais → Google
export async function sincronizarParaGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  // Buscar agendamentos sem googleEventId
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      googleEventId: null,
      dataHora: { gte: inicio, lte: fim },
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

// Sincronizar: importar eventos do Google → sistema local
export async function sincronizarDoGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  const eventosGoogle = await buscarEventosGoogle(userId, inicio, fim)

  // IDs de eventos Google já vinculados
  const jaVinculados = await prisma.agendamento.findMany({
    where: { googleEventId: { not: null } },
    select: { googleEventId: true },
  })
  const idsExistentes = new Set(jaVinculados.map(a => a.googleEventId))

  let importados = 0
  for (const evento of eventosGoogle) {
    if (!evento.id || idsExistentes.has(evento.id)) continue
    if (evento.status === 'cancelled') continue

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

  return { importados }
}

// ============================================================
// HELPERS
// ============================================================

function getTipoColorId(tipo?: string): string {
  // Google Calendar color IDs: 1-11
  switch (tipo) {
    case 'audiencia': return '11'  // vermelho
    case 'prazo': return '6'       // laranja
    case 'reuniao': return '7'     // azul
    case 'consulta': return '2'    // verde
    case 'retorno': return '5'     // amarelo
    default: return '1'            // lavanda
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
