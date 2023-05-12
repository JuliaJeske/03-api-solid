import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null
      },
      async create(data) {
        return {
          id: 'user1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'julinha',
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    const isPasswordCorrectHashed = await compare('1234567', user.password_hash)

    expect(isPasswordCorrectHashed).toBe(true)
  })
})
