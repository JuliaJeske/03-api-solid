import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  // cada classe etar um metodo
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6) // 6 = numero de vezes que vai gerar o round
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (userWithSameEmail) {
      throw new Error('email already exists')
    }
    // const prismaUsersRepository = new PrismaUserRepository()
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
