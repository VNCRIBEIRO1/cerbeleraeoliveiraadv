import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        advogado: { select: { id: true, nome: true } },
        processos: {
          include: {
            _count: { select: { prazos: true, andamentos: true } },
          },
          orderBy: { criadoEm: 'desc' },
        },
        agendamentos: { orderBy: { dataHora: 'desc' }, take: 10 },
        pagamentos: {
          include: { parcelas: true },
          orderBy: { criadoEm: 'desc' },
        },
        documentos: { orderBy: { criadoEm: 'desc' } },
      },
    })

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome: dados.nome,
        cpfCnpj: dados.cpfCnpj,
        email: dados.email,
        telefone: dados.telefone,
        whatsapp: dados.whatsapp,
        endereco: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        observacoes: dados.observacoes,
        status: dados.status,
        advogadoId: dados.advogadoId,
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.cliente.delete({ where: { id } })
    return NextResponse.json({ message: 'Cliente removido' })
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
