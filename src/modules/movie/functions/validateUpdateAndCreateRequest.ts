import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from 'src/functions/throwError';
import MovieRequest from '../interfaces/MovieRequest';

const validateUpdateAndCreateRequest = (
  request: MovieRequest,
): void => {
  for (const prop in request) {
    if (!request[prop])
      throwError(
        responseEstatuses.BAD_REQUEST,
        `Invalid ${prop} format. ${prop} cannot be null.`,
      );
  }
};

export default validateUpdateAndCreateRequest;
