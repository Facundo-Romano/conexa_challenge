import { FindOptionsWhere, Repository } from 'typeorm';

export default async function findEntities<T>(
  repository: Repository<T>,
  data: string[],
): Promise<T[]> {
  const entities: T[] = [];

  for (const item of data) {
    //Where conditions needs to be typed explicitly, so findOne methods recognizes its type.
    const whereCondition = { url: item } as unknown as FindOptionsWhere<T>;

    const existingEntity = await repository.findOne({ where: whereCondition });

    entities.push(existingEntity);
  }

  return entities;
}
