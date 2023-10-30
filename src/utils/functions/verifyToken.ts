import { JwtPayload, verify } from 'jsonwebtoken';
import throwError from './throwError';
import { responseEstatuses } from '../enums/responseStatuses';

const verifyToken = (token: string): JwtPayload => {
  const jwtPayload = verify(token, process.env.SECRET_KEY);

  if (!jwtPayload || typeof jwtPayload === 'string')
    throwError(responseEstatuses.FORBIDDEN, 'Please provide a valid token.');

  return jwtPayload as JwtPayload;
};

export default verifyToken;
