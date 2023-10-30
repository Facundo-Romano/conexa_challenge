import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from '../../../functions/throwError';
import validateEmail from './validateEmail';
import validatePassword from './validatePassword';
import RegisterRequest from '../interfaces/RegisterRequest';

const validateRegisterRequest = (request: RegisterRequest): void => {
  if (!request.hasOwnProperty('firstName'))
    throwError(responseEstatuses.BAD_REQUEST, 'FirstName is required.');
  if (!request.hasOwnProperty('lastName'))
    throwError(responseEstatuses.BAD_REQUEST, 'Lastname is required.');
  if (!request.hasOwnProperty('email'))
    throwError(responseEstatuses.BAD_REQUEST, 'Email is required.');
  if (!request.hasOwnProperty('password'))
    throwError(responseEstatuses.BAD_REQUEST, 'Password is required.');

  if (!request.firstName)
    throwError(responseEstatuses.BAD_REQUEST, 'FirstName cannot be empty.');

  if (!request.lastName)
    throwError(responseEstatuses.BAD_REQUEST, 'LastName cannot be empty.');

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

export default validateRegisterRequest;
