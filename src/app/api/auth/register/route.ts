import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, role, chaveAdmin } = await request.json()

    // Chave de segurança para criar primeiro usuário
    const chaveCorreta = process.env.ADMIN_KEY || 'cerbelera2025'
    if (!chaveAdmin || chaveAdmin !== chaveCorreta) {
      return NextResponse.json({ error: 'Chave de administrador inválida' }, { status: 403 })
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }

    const existente = await prisma.user.findUnique({ where: { email } })
    if (existente) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const senhaHash = await hashPassword(senha)

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: role || 'advogado',
      },
    })

    return NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    }, { status: 201 })
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
