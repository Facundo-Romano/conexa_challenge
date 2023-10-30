import { AuthService } from '../../../src/modules/auth/auth.service';
import { User } from '../../../src/typeorm/entities/User';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from 'src/utils/enums/UserRole';
import * as bcrypt from 'bcrypt';
import * as validateLoginRequest from 'src/modules/auth/functions/validateLoginRequest';
import * as validateRegisterRequest from 'src/modules/auth/functions/validateRegisterRequest';
import * as generateJwt from 'src/modules/auth/functions/generateJwt';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;
  let user: User;
  let token: string;

  beforeEach(() => {
    userRepository = new Repository<User>(User, entityManager);
    authService = new AuthService(userRepository);
    user = new User();
    user.id = 1;
    user.firstName = 'firstName';
    user.lastName = 'lastName';
    user.email = 'email@email.com';
    user.password = 'Password*123';
    user.role = UserRole.USER;

    token = 'token';
    process.env.SECRET_KEY = 'secretKey';
    process.env.TOKEN_EXPIRATION = '1d';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should return a user', async () => {
      jest.spyOn(validateLoginRequest, 'default').mockImplementation();
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => null);
      jest.spyOn(userRepository, 'create').mockImplementation(() => user);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(userRepository, 'save').mockImplementation(async () => user);

      const returnValue: User = await authService.register(user);

      expect(returnValue).toEqual(user);
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      jest.spyOn(validateLoginRequest, 'default').mockImplementation();
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest.spyOn(generateJwt, 'default').mockImplementation(() => token);

      const returnValue: string = await authService.login(user);

      expect(returnValue).toEqual(token);
    });
  });

  describe('register error - invalid request', () => {
    it('should return an HttpExeption when email format is incorrect', async () => {
      try {
        user.email = 'invalidEmail';
        await authService.register(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('Invalid email format.');
      }
    });
    it('should return an HttpExeption when password format is incorrect', async () => {
      try {
        user.password = 'invalidPassword';
        await authService.register(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual(
          'Invalid password format. Password should be at least 12 characters long, have at least one uppercase letter and have at least one special character.',
        );
      }
    });
    it('should return an HttpExeption when firstName format is incorrect', async () => {
      try {
        user.firstName = '';
        await authService.register(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('FirstName cannot be empty.');
      }
    });
    it('should return an HttpExeption when lastName format is incorrect', async () => {
      try {
        user.lastName = '';
        await authService.register(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('LastName cannot be empty.');
      }
    });
  });

  describe('register error - email already in use', () => {
    it('should return an HttpExeption', async () => {
      try {
        jest.spyOn(validateRegisterRequest, 'default').mockImplementation();
        jest
          .spyOn(userRepository, 'findOne')
          .mockImplementation(async () => user);

        await authService.register(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.CONFLICT);
        expect(err.message).toEqual('Email already in use.');
      }
    });
  });

  describe('login error - invalid request', () => {
    it('should return an HttpExeption when email format is incorrect', async () => {
      try {
        user.email = 'invalidPassword';

        await authService.login(user);
      } catch (err) {
        expect(err.message).toEqual('Invalid email format.');
      }
    });
    it('should return an HttpExeption when password format is incorrect', async () => {
      try {
        user.password = 'invalidPassword';
        await authService.login(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual(
          'Invalid password format. Password should be at least 12 characters long, have at least one uppercase letter and have at least one special character.',
        );
      }
    });
  });

  describe('login error - invalid credentials', () => {
    it('should return an HttpExeption when user is not found', async () => {
      try {
        jest.spyOn(validateLoginRequest, 'default').mockImplementation();
        jest
          .spyOn(userRepository, 'findOne')
          .mockImplementation(async () => null);

        await authService.login(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('Invalid credentials.');
      }
    });
    it(`should return an HttpExeption when user password and provided password don't match`, async () => {
      try {
        jest.spyOn(validateLoginRequest, 'default').mockImplementation();
        jest
          .spyOn(userRepository, 'findOne')
          .mockImplementation(async () => user);
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

        await authService.login(user);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('Invalid credentials.');
      }
    });
  });
});
