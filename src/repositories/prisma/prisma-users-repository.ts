import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

// metodos que vai interceptar as operacoes no banco de dados
export class PrismaUserRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}

// Prisma.UserCreateInput -> prisma cria uma "imagem"(tipagem) dos dados que iremos passar ao criar um usuario
