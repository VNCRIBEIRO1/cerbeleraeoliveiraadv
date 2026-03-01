import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/contato - Recebe mensagens do formulário de contato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, telefone, assunto, mensagem } = body;

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, email e mensagem' },
        { status: 400 }
      );
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      );
    }

    // Criar como triagem para aparecer no painel CMS
    const triagem = await prisma.triagem.create({
      data: {
        nome,
        telefone: telefone?.replace(/\D/g, '') || email,
        area: assunto || 'Contato via Site',
        subarea: 'Formulário de Contato',
        urgencia: 'baixa',
        detalhes: [
          `📧 Mensagem via formulário de contato`,
          ``,
          `E-mail: ${email}`,
          telefone ? `Telefone: ${telefone}` : '',
          assunto ? `Assunto: ${assunto}` : '',
          ``,
          `Mensagem:`,
          mensagem,
        ].filter(Boolean).join('\n'),
        status: 'pendente',
      },
    });

    // Tentar enviar notificação via Google Calendar (nota/lembrete)
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

        const now = new Date();
        const endTime = new Date(now);
        endTime.setMinutes(endTime.getMinutes() + 15);

        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `📩 Contato Site - ${nome}`,
            description: [
              `Nova mensagem de contato via site`,
              ``,
              `Nome: ${nome}`,
              `E-mail: ${email}`,
              telefone ? `Telefone: ${telefone}` : '',
              assunto ? `Assunto: ${assunto}` : '',
              ``,
              `Mensagem:`,
              mensagem,
              ``,
              `Triagem #${triagem.id}`,
            ].filter(Boolean).join('\n'),
            start: {
              dateTime: now.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
            colorId: '11', // vermelho tomate (urgente)
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'popup', minutes: 0 },
              ],
            },
          },
        });
      }
    } catch (calendarError) {
      console.error('Erro ao criar notificação no Google Calendar:', calendarError);
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso',
      triagem: { id: triagem.id },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao processar contato:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar mensagem' },
      { status: 500 }
    );
  }
}
