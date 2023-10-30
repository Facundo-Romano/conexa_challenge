import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { User } from '../../../src/typeorm/entities/User';
import { EntityManager, Repository } from 'typeorm';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;
  let user: User;
  let response: any;
  let token: string;

  beforeEach(() => {
    userRepository = new Repository<User>(User, entityManager);
    authService = new AuthService(userRepository);
    authController = new AuthController(authService);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    user = new User();
    user.firstName = 'firstName';
    user.lastName = 'lastName';
    user.email = 'email@email.com';
    user.password = 'Password*123';

    token = "token"
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  })

  describe('register', () => {
    it('should return a user', async () => {
      jest.spyOn(authService, 'register').mockImplementation(async () => user);

      await authController.register(response, user);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'User created successfully.',
        results: [user],
      });
    });
  });

  
  describe('login', () => {
    it('should return a token', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => token);

      await authController.login(response, user);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'LoggedIn successfully.',
        results: [{ token }],
      });
    });
  });
});
