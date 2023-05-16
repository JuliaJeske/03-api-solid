import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym01',
      title: 'academia teste',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to Check In', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym01',
      userId: 'user02',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to Check In on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym02',
      title: 'academia teste',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym02',
        userId: 'user02',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should not be able to Check In twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym01',
      userId: 'user02',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym01',
        userId: 'user02',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should  be able to Check In twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym01',
      userId: 'user02',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym01',
      userId: 'user02',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
