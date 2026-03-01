import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/agendamento-publico - Agendamento público (sem auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, telefone, tipo, descricao, dataHora } = body;

    if (!nome || !telefone || !tipo || !dataHora) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, telefone, tipo e dataHora' },
        { status: 400 }
      );
    }

    const dataAgendamento = new Date(dataHora);
    if (isNaN(dataAgendamento.getTime())) {
      return NextResponse.json({ error: 'Data/hora inválida' }, { status: 400 });
    }

    // Verificar se horário não está ocupado
    const inicio = new Date(dataAgendamento);
    const fim = new Date(dataAgendamento);
    fim.setMinutes(fim.getMinutes() + 30);

    const conflito = await prisma.agendamento.findFirst({
      where: {
        dataHora: {
          gte: inicio,
          lt: fim,
        },
        status: { not: 'cancelado' },
      },
    });

    if (conflito) {
      return NextResponse.json(
        { error: 'Este horário já está ocupado. Por favor, escolha outro horário.' },
        { status: 409 }
      );
    }

    // Mapear tipo para area da triagem
    const tipoParaArea: Record<string, string> = {
      trabalhista: 'Direito Trabalhista',
      previdenciario: 'Direito Previdenciário',
      civil: 'Direito Civil',
      familia: 'Direito de Família',
      consumidor: 'Direito do Consumidor',
      empresarial: 'Direito Empresarial',
      imobiliario: 'Direito Imobiliário',
      outro: 'Outro',
    };

    // 1. Criar triagem
    const triagem = await prisma.triagem.create({
      data: {
        nome,
        telefone,
        area: tipoParaArea[tipo] || 'Outro',
        subarea: 'Agendamento Online',
        urgencia: 'media',
        detalhes: descricao || `Agendamento online - ${tipoParaArea[tipo] || tipo}`,
        status: 'nova',
      },
    });

    // 2. Criar agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        titulo: `Consulta ${tipoParaArea[tipo] || tipo} - ${nome}`,
        dataHora: dataAgendamento,
        duracao: 30,
        tipo: 'consulta',
        local: 'Escritório',
        status: 'pendente',
        observacoes: [
          `Agendamento via site`,
          `Telefone: ${telefone}`,
          `Área: ${tipoParaArea[tipo] || tipo}`,
          descricao ? `Descrição: ${descricao}` : '',
          `Triagem #${triagem.id}`,
        ].filter(Boolean).join('\n'),
      },
    });

    // 3. Tentar sincronizar com Google Calendar (se configurado)
    try {
      const user = await prisma.user.findFirst();
      if (user?.googleAccessToken && user?.googleRefreshToken) {
        const { google } = await import('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken,
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const endTime = new Date(dataAgendamento);
        endTime.setMinutes(endTime.getMinutes() + 30);

        const event = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `📅 Consulta - ${nome}`,
            description: [
              `Cliente: ${nome}`,
              `Telefone: ${telefone}`,
              `Área: ${tipoParaArea[tipo] || tipo}`,
              descricao ? `Descrição: ${descricao}` : '',
              `\nAgendado via site | Triagem #${triagem.id}`,
            ].filter(Boolean).join('\n'),
            start: {
              dateTime: dataAgendamento.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
            colorId: '5', // amarelo (banana)
          },
        });

        // Salvar ID do Google Calendar no agendamento
        if (event.data.id) {
          await prisma.agendamento.update({
            where: { id: agendamento.id },
            data: { googleEventId: event.data.id },
          });
        }
      }
    } catch (googleError) {
      console.error('Erro ao sincronizar com Google Calendar (não crítico):', googleError);
      // Não falha o agendamento se Google Calendar não funcionar
    }

    return NextResponse.json({
      success: true,
      agendamento: {
        id: agendamento.id,
        titulo: agendamento.titulo,
        dataHora: agendamento.dataHora,
      },
      triagem: {
        id: triagem.id,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no agendamento público:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar agendamento' },
      { status: 500 }
    );
  }
}
