import { SearchGymsUseCase } from '../search-gyms'
import { PrismaGymsRespository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsyUseCase() {
  const gymsRepository = new PrismaGymsRespository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
