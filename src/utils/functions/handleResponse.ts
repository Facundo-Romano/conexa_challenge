import { Response } from 'express';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';

const handleResponse = <T>(
  results: T[] = [],
  message: string,
  res: Response,
): Response => {
  return res.status(responseEstatuses.SUCESS).json({
    message,
    results,
  });
};

export default handleResponse;
