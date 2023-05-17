import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym-01',
      title: 'Typescript gym',
      description: '',
      phone: '',
      latitude: new Decimal(22.7283774),
      longitude: new Decimal(-47.1664975),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 22.7283774,
      userLongitude: -47.1664975,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 22.7283774,
      userLongitude: -47.1664975,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: 22.7283774,
        userLongitude: -47.1664975,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 22.7283774,
      userLongitude: -47.1664975,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 22.7283774,
      userLongitude: -47.1664975,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'Javascript gym',
      description: '',
      phone: '',
      longitude: new Decimal(22.6630501),
      latitude: new Decimal(-47.1724199),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: 22.7283774,
        userLongitude: -47.1664975,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
