import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const user = this.gyms.find((u) => u.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
