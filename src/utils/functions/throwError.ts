import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import { HttpException } from '@nestjs/common';

const throwError = (
  status: responseEstatuses,
  message: string,
): HttpException => {
  throw new HttpException(message, status);
};

export default throwError;
