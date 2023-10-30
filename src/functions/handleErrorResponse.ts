import { Response } from 'express';
import { responseEstatuses } from 'src/enums/responseStatuses';
import CustomError from 'src/classes/CustomError';

const handleErrorResponse = (err: CustomError, res: Response): Response => {
  const { status, message } = err;

  return res.status(status || responseEstatuses.ERROR).json({
    message,
    results: [],
  });
};

export default handleErrorResponse;
