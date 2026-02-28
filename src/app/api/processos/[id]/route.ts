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

    // Monta apenas os campos enviados (partial update)
    const updateData: Record<string, unknown> = {}
    if (dados.numero !== undefined) updateData.numero = dados.numero || null
    if (dados.tipo !== undefined) updateData.tipo = dados.tipo
    if (dados.assunto !== undefined) updateData.assunto = dados.assunto
    if (dados.descricao !== undefined) updateData.descricao = dados.descricao || null
    if (dados.status !== undefined) updateData.status = dados.status
    if (dados.vara !== undefined) updateData.vara = dados.vara || null
    if (dados.comarca !== undefined) updateData.comarca = dados.comarca || null
    if (dados.foro !== undefined) updateData.foro = dados.foro || null
    if (dados.valorCausa !== undefined) updateData.valorCausa = dados.valorCausa ? parseFloat(dados.valorCausa) : null
    if (dados.parteContraria !== undefined) updateData.parteContraria = dados.parteContraria || null
    if (dados.advContrario !== undefined) updateData.advContrario = dados.advContrario || null
    if (dados.dataDistribuicao !== undefined) updateData.dataDistribuicao = dados.dataDistribuicao ? new Date(dados.dataDistribuicao) : null
    if (dados.dataConclusao !== undefined) updateData.dataConclusao = dados.dataConclusao ? new Date(dados.dataConclusao) : null
    if (dados.observacoes !== undefined) updateData.observacoes = dados.observacoes || null
    if (dados.advogadoId !== undefined) updateData.advogadoId = dados.advogadoId || null

    const processo = await prisma.processo.update({
      where: { id },
      data: updateData,
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
