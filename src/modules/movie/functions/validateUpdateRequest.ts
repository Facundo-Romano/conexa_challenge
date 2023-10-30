import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from 'src/functions/throwError';

const validateUpdateRequest = <T extends Record<string, any>>(
  request: T,
): void => {
  for (const prop in request) {
    if (!request[prop])
      throwError(
        responseEstatuses.BAD_REQUEST,
        `Invalid ${prop} format. ${prop} cannot be null.`,
      );
    break;
  }
};

export default validateUpdateRequest;
