import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@cerbeleraoliveira.adv.br'

  const existente = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existente) {
    console.log('✓ Usuário admin já existe:', existente.email)
    return
  }

  const senhaHash = await hash('Cerbelera@2025', 12)

  const admin = await prisma.user.create({
    data: {
      nome: 'Administrador Geral',
      email: adminEmail,
      senha: senhaHash,
      role: 'admin',
      ativo: true,
    },
  })

  console.log('✓ Usuário admin criado com sucesso!')
  console.log('  Email:', admin.email)
  console.log('  Senha: Cerbelera@2025')
  console.log('  Role:', admin.role)
  console.log('')
  console.log('⚠  ALTERE A SENHA APÓS O PRIMEIRO LOGIN')
}

main()
  .catch((e) => {
    console.error('Erro ao criar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
