import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    // Atualizar parcela específica
    if (dados.parcelaId) {
      const parcela = await prisma.parcela.update({
        where: { id: dados.parcelaId },
        data: {
          status: dados.parcelaStatus || 'pago',
          dataPagamento: dados.parcelaStatus === 'pago' ? new Date() : null,
        },
      })

      // Verificar se todas as parcelas foram pagas
      const todasParcelas = await prisma.parcela.findMany({
        where: { pagamentoId: id },
      })
      const todasPagas = todasParcelas.every(p => p.status === 'pago')
      const algumaPaga = todasParcelas.some(p => p.status === 'pago')

      await prisma.pagamento.update({
        where: { id },
        data: { status: todasPagas ? 'pago' : algumaPaga ? 'parcial' : 'pendente' },
      })

      return NextResponse.json(parcela)
    }

    // Atualizar pagamento
    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: {
        descricao: dados.descricao,
        valorTotal: dados.valorTotal ? parseFloat(dados.valorTotal) : undefined,
        formaPagamento: dados.formaPagamento,
        status: dados.status,
        observacoes: dados.observacoes,
      },
    })

    return NextResponse.json(pagamento)
  } catch (error) {
    console.error('Erro ao atualizar financeiro:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.parcela.deleteMany({ where: { pagamentoId: id } })
    await prisma.pagamento.delete({ where: { id } })
    return NextResponse.json({ message: 'Pagamento removido' })
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
