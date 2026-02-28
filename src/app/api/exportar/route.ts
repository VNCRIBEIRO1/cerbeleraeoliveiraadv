import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'clientes'
    const formato = searchParams.get('formato') || 'csv'

    let dados: Record<string, unknown>[] = []
    let nomeArquivo = ''

    switch (tipo) {
      case 'clientes': {
        const clientes = await prisma.cliente.findMany({
          include: { advogado: { select: { nome: true } } },
          orderBy: { nome: 'asc' },
        })
        dados = clientes.map(c => ({
          Nome: c.nome,
          'CPF/CNPJ': c.cpfCnpj || '',
          Email: c.email || '',
          Telefone: c.telefone,
          WhatsApp: c.whatsapp || '',
          Endereco: c.endereco || '',
          Cidade: c.cidade || '',
          Estado: c.estado || '',
          CEP: c.cep || '',
          Status: c.status,
          Origem: c.origem,
          Advogado: c.advogado?.nome || '',
          'Data Cadastro': c.criadoEm.toISOString().split('T')[0],
        }))
        nomeArquivo = `clientes_${new Date().toISOString().split('T')[0]}`
        break
      }

      case 'processos': {
        const processos = await prisma.processo.findMany({
          include: {
            cliente: { select: { nome: true } },
            advogado: { select: { nome: true } },
          },
          orderBy: { criadoEm: 'desc' },
        })
        dados = processos.map(p => ({
          Numero: p.numero || '',
          Tipo: p.tipo,
          Assunto: p.assunto,
          Status: p.status,
          Vara: p.vara || '',
          Comarca: p.comarca || '',
          'Valor Causa': p.valorCausa || '',
          Cliente: p.cliente.nome,
          Advogado: p.advogado?.nome || '',
          'Data Distribuicao': p.dataDistribuicao?.toISOString().split('T')[0] || '',
          'Data Cadastro': p.criadoEm.toISOString().split('T')[0],
        }))
        nomeArquivo = `processos_${new Date().toISOString().split('T')[0]}`
        break
      }

      case 'financeiro': {
        const pagamentos = await prisma.pagamento.findMany({
          include: {
            cliente: { select: { nome: true } },
            parcelas: true,
          },
          orderBy: { criadoEm: 'desc' },
        })
        dados = []
        for (const pag of pagamentos) {
          for (const parcela of pag.parcelas) {
            dados.push({
              Cliente: pag.cliente.nome,
              Descricao: pag.descricao,
              'Parcela N': parcela.numero,
              Valor: parcela.valor,
              Vencimento: parcela.dataVencimento.toISOString().split('T')[0],
              'Data Pagamento': parcela.dataPagamento?.toISOString().split('T')[0] || '',
              Status: parcela.status,
              'Forma Pagamento': pag.formaPagamento || '',
            })
          }
        }
        nomeArquivo = `financeiro_${new Date().toISOString().split('T')[0]}`
        break
      }

      case 'prazos': {
        const prazos = await prisma.prazo.findMany({
          include: {
            processo: {
              select: { numero: true, assunto: true, cliente: { select: { nome: true } } },
            },
          },
          orderBy: { dataLimite: 'asc' },
        })
        dados = prazos.map(p => ({
          Titulo: p.titulo,
          Descricao: p.descricao || '',
          'Data Limite': p.dataLimite.toISOString().split('T')[0],
          Tipo: p.tipo,
          Status: p.status,
          Prioridade: p.prioridade,
          Processo: p.processo.numero || p.processo.assunto,
          Cliente: p.processo.cliente.nome,
        }))
        nomeArquivo = `prazos_${new Date().toISOString().split('T')[0]}`
        break
      }

      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    if (formato === 'json') {
      return new NextResponse(JSON.stringify(dados, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${nomeArquivo}.json"`,
        },
      })
    }

    // CSV
    if (dados.length === 0) {
      return new NextResponse('Sem dados', {
        headers: { 'Content-Type': 'text/csv' },
      })
    }

    const headers = Object.keys(dados[0])
    const csvLinhas = [
      headers.join(';'),
      ...dados.map(row =>
        headers.map(h => {
          const val = String(row[h] ?? '')
          return val.includes(';') || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"`
            : val
        }).join(';')
      ),
    ]

    return new NextResponse('\uFEFF' + csvLinhas.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${nomeArquivo}.csv"`,
      },
    })
  } catch (error) {
    console.error('Erro na exportação:', error)
    return NextResponse.json({ error: 'Erro na exportação' }, { status: 500 })
  }
}
