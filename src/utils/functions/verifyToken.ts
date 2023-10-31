import { JwtPayload, verify } from 'jsonwebtoken';
import throwError from './throwError';
import { responseEstatuses } from '../enums/responseStatuses';

const verifyToken = (token: string): JwtPayload => {
  try {
    const jwtPayload = verify(token, process.env.SECRET_KEY);

    if (!jwtPayload || typeof jwtPayload === 'string') throw new Error();

    return jwtPayload as JwtPayload;
  } catch (err) {
    throwError(responseEstatuses.FORBIDDEN, 'Please provide a valid token.');
  }
};

export default verifyToken;
