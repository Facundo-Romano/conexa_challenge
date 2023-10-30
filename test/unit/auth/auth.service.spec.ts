import validateRegisterRequest from 'src/modules/auth/functions/validateRegisterRequest';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { User } from '../../../src/typeorm/entities/User';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from 'src/utils/enums/UserRole';
import * as bcrypt from 'bcrypt';
import * as validateLoginRequest from 'src/modules/auth/functions/validateLoginRequest';
import * as generateJwt from 'src/modules/auth/functions/generateJwt';

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

    token = "token";
    process.env.SECRET_KEY = 'secretKey';
    process.env.TOKEN_EXPIRATION = '1d';
  });

  describe('register', () => {
    it('should return a user', async () => {
        jest.spyOn(validateLoginRequest, 'default').mockImplementation();
        jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);
        jest.spyOn(userRepository, 'create').mockImplementation(() => user);
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
        jest.spyOn(userRepository, 'save').mockImplementation(async () => user);
        
        const returnValue: User = await authService.register(user);
        
        expect(returnValue).toBe(user);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
        jest.spyOn(validateLoginRequest, 'default').mockImplementation();
        jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
        jest.spyOn(generateJwt, 'default').mockImplementation(() => token);
        
        const returnValue: string = await authService.login(user);
        
        expect(returnValue).toBe(token);
    });
  });
});
