import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const clienteId = searchParams.get('clienteId') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (clienteId) where.clienteId = clienteId

    const [pagamentos, total] = await Promise.all([
      prisma.pagamento.findMany({
        where,
        include: {
          cliente: { select: { id: true, nome: true } },
          processo: { select: { id: true, numero: true, assunto: true } },
          parcelas: { orderBy: { numero: 'asc' } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.pagamento.count({ where }),
    ])

    // Calcular resumo financeiro
    const resumo = await prisma.pagamento.aggregate({
      _sum: { valorTotal: true },
    })

    const parcelasAtrasadas = await prisma.parcela.count({
      where: {
        status: 'pendente',
        dataVencimento: { lt: new Date() },
      },
    })

    const totalRecebido = await prisma.parcela.aggregate({
      where: { status: 'pago' },
      _sum: { valor: true },
    })

    const totalPendente = await prisma.parcela.aggregate({
      where: { status: 'pendente' },
      _sum: { valor: true },
    })

    return NextResponse.json({
      pagamentos,
      total,
      paginas: Math.ceil(total / limite),
      resumo: {
        totalGeral: resumo._sum.valorTotal || 0,
        totalRecebido: totalRecebido._sum.valor || 0,
        totalPendente: totalPendente._sum.valor || 0,
        parcelasAtrasadas,
      },
    })
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json()

    const pagamento = await prisma.pagamento.create({
      data: {
        descricao: dados.descricao,
        valorTotal: parseFloat(dados.valorTotal),
        formaPagamento: dados.formaPagamento || null,
        status: dados.status || 'pendente',
        observacoes: dados.observacoes || null,
        clienteId: dados.clienteId,
        processoId: dados.processoId || null,
        parcelas: dados.parcelas?.length > 0 ? {
          create: dados.parcelas.map((p: { numero: number; valor: string; dataVencimento: string }) => ({
            numero: p.numero,
            valor: parseFloat(p.valor as string),
            dataVencimento: new Date(p.dataVencimento),
            status: 'pendente',
          })),
        } : undefined,
      },
      include: {
        parcelas: true,
        cliente: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json(pagamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
  }
}
