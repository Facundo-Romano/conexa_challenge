import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import MovieRequest from '../interfaces/MovieRequest';
import throwError from 'src/utils/functions/throwError';

const validateUpdateAndCreateRequest = (request: MovieRequest): void => {
  for (const prop in request) {
    if (!request[prop])
      throwError(
        responseEstatuses.BAD_REQUEST,
        `Invalid ${prop} format. ${prop} cannot be null.`,
      );
  }
};

export default validateUpdateAndCreateRequest;
