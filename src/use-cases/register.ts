import { prisma } from '@/lib/prisma'
import { PrismaUserRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface registerUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: registerUseCaseRequest) {
  const password_hash = await hash(password, 6) // 6 = numero de vezes que vai gerar o round

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('email already exists')
  }

  const prismaUsersRepository = new PrismaUserRepository()
  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
