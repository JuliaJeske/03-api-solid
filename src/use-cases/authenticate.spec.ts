import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'pedro',
      email: 'julinha@gmail.com',
      password_hash: await hash('1234567', 6),
    })

    const { user } = await sut.execute({
      email: 'julinha@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'julinha@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'pedro',
      email: 'julinha@gmail.com',
      password_hash: await hash('1234567', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'julinha@gmail.com',
        password: '1234568',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
