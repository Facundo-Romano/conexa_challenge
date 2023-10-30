import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from 'src/functions/throwError';
import { FindOptionsWhere, Repository } from 'typeorm';

export default async function findEntities<T>(
  repository: Repository<T>,
  data: string[],
  entityName: string,
): Promise<T[]> {
  const entities: T[] = [];

  for (const item of data) {
    //Where conditions needs to be typed explicitly, so findOne methods recognizes its type.
    const whereCondition = { url: item } as unknown as FindOptionsWhere<T>;

    const existingEntity = await repository.findOne({ where: whereCondition });

    if (!existingEntity) {
      throwError(responseEstatuses.NOT_FOUND, `${entityName} not found.`);
    }
    entities.push(existingEntity);
  }

  return entities;
}
