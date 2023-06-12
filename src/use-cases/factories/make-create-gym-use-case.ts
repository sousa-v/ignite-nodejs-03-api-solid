import { PrismaGymsRespository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRespository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
