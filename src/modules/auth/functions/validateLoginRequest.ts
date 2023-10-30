import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from '../../../functions/throwError';
import LoginRequest from '../interfaces/LoginRquest';
import validateEmail from './validateEmail';
import validatePassword from './validatePassword';

const validateLoginRequest = (request: LoginRequest): void => {
  if (!request.hasOwnProperty('email'))
    throwError(responseEstatuses.BAD_REQUEST, 'Email is required.');
  if (!request.hasOwnProperty('password'))
    throwError(responseEstatuses.BAD_REQUEST, 'Password is required.');

  const isEmailValid: boolean = validateEmail(request.email);
  if (!isEmailValid)
    throwError(responseEstatuses.BAD_REQUEST, 'Invalid email format.');

  const isPasswordValid: boolean = validatePassword(request.password);
  if (!isPasswordValid)
    throwError(
      responseEstatuses.BAD_REQUEST,
      'Invalid password format. Password should be at least 12 characters long, have at least one uppercase letter and have at least one special character.',
    );
};

export default validateLoginRequest;
