import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const dados = await request.json()

    // Se for converter triagem em cliente
    if (dados.converter) {
      const triagem = await prisma.triagem.findUnique({ where: { id } })
      if (!triagem) {
        return NextResponse.json({ error: 'Triagem não encontrada' }, { status: 404 })
      }

      const cliente = await prisma.cliente.create({
        data: {
          nome: triagem.nome,
          telefone: triagem.telefone,
          whatsapp: triagem.telefone,
          email: dados.email || null,
          cpfCnpj: dados.cpfCnpj || null,
          endereco: dados.endereco || null,
          cidade: dados.cidade || null,
          estado: dados.estado || null,
          origem: 'chatbot',
          status: 'ativo',
          observacoes: dados.observacoes || `Convertido da triagem - Área: ${triagem.area} | Subárea: ${triagem.subarea} | Urgência: ${triagem.urgencia}`,
        },
      })

      await prisma.triagem.update({
        where: { id },
        data: { status: 'convertida', clienteId: cliente.id },
      })

      return NextResponse.json({ triagem: { ...triagem, status: 'convertida' }, cliente })
    }

    // Atualizar status da triagem
    const triagem = await prisma.triagem.update({
      where: { id },
      data: {
        status: dados.status,
        observacoes: dados.observacoes,
      },
    })

    return NextResponse.json(triagem)
  } catch (error) {
    console.error('Erro ao atualizar triagem:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.triagem.delete({ where: { id } })
    return NextResponse.json({ message: 'Triagem removida' })
  } catch (error) {
    console.error('Erro ao deletar triagem:', error)
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 })
  }
}
