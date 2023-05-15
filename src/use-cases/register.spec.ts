import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'julinha',
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'julinha',
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    const isPasswordCorrectHashed = await compare('1234567', user.password_hash)

    expect(isPasswordCorrectHashed).toBe(true)
  })
  it('should not be able to register with  same email twice', async () => {
    const email = 'johnDoe@gmail.com'

    await sut.execute({
      name: 'john doe',
      email,
      password: '1234567',
    })
    await expect(() =>
      sut.execute({
        name: 'john doe',
        email,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
