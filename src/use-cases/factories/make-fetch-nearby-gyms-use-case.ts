import { PrismaGymsRespository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRespository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
