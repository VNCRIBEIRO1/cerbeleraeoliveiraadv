import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const processo = await prisma.processo.findUnique({
      where: { id },
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
        advogado: { select: { id: true, nome: true } },
        prazos: { orderBy: { dataLimite: 'asc' } },
        andamentos: { orderBy: { data: 'desc' } },
        documentos: { orderBy: { criadoEm: 'desc' } },
        pagamentos: { include: { parcelas: { orderBy: { numero: 'asc' } } } },
      },
    })

    if (!processo) {
      return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 })
    }

    return NextResponse.json(processo)
  } catch (error) {
    console.error('Erro ao buscar processo:', error)
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

    const processo = await prisma.processo.update({
      where: { id },
      data: {
        numero: dados.numero,
        tipo: dados.tipo,
        assunto: dados.assunto,
        descricao: dados.descricao,
        status: dados.status,
        vara: dados.vara,
        comarca: dados.comarca,
        valorCausa: dados.valorCausa ? parseFloat(dados.valorCausa) : null,
        dataDistribuicao: dados.dataDistribuicao ? new Date(dados.dataDistribuicao) : null,
        observacoes: dados.observacoes,
        advogadoId: dados.advogadoId,
      },
    })

    return NextResponse.json(processo)
  } catch (error) {
    console.error('Erro ao atualizar processo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.processo.delete({ where: { id } })
    return NextResponse.json({ message: 'Processo removido' })
  } catch (error) {
    console.error('Erro ao deletar processo:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
