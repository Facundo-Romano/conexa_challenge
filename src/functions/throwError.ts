import { responseEstatuses } from 'src/enums/responseStatuses';
import CustomError from 'src/classes/CustomError';

const throwError = (
  status: responseEstatuses,
  message: string,
): CustomError => {
  throw new CustomError(status, message);
};

export default throwError;
