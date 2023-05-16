import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to  get check ins count metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user02',
    })
    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user02',
    })
    const { checkInsCount } = await sut.execute({
      userId: 'user02',
    })

    expect(checkInsCount).toEqual(2)
  })
})
