import { sign } from 'jsonwebtoken';
import { User } from 'src/typeorm/entities/User';

const generateJwt = (payload: User): string => {
  return sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
};

export default generateJwt;
