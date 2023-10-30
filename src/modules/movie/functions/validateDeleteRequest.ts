import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import DeleteMoviesRequest from '../interfaces/DeleteMoviesRequest';
import throwError from 'src/utils/functions/throwError';

const validateDeleteRequest = (request: DeleteMoviesRequest): void => {
  if (!request.hasOwnProperty('ids'))
    throwError(responseEstatuses.BAD_REQUEST, 'Ids are required.');
};

export default validateDeleteRequest;
