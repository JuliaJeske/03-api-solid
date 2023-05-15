import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'julinha',
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'julinha',
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    const isPasswordCorrectHashed = await compare('1234567', user.password_hash)

    expect(isPasswordCorrectHashed).toBe(true)
  })
  it('should not be able to register with  same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'julinhaa@gmail.com'

    await registerUseCase.execute({
      name: 'julinha',
      email,
      password: '1234567',
    })
    await expect(() =>
      registerUseCase.execute({
        name: 'julinha',
        email,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
