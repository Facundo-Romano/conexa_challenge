import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from 'src/functions/throwError';
import DeleteMoviesRequest from '../interfaces/DeleteMoviesRequest';

const validateDeleteRequest = (request: DeleteMoviesRequest): void => {
  if (!request.hasOwnProperty('ids'))
    throwError(responseEstatuses.BAD_REQUEST, 'Ids are required.');
};

export default validateDeleteRequest;
