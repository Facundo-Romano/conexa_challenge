import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { AdminGuard } from 'src/modules/guards/admin.guard';
import { User } from 'src/typeorm/entities/User';
import { UserRole } from 'src/utils/enums/UserRole';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import * as verifyToken from 'src/utils/functions/verifyToken';
import { EntityManager, Repository } from 'typeorm';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;
  let validTokenExecutionContext: ExecutionContext;
  let invalidTokenExecutionContext: ExecutionContext;
  let noTokenExecutionContext: ExecutionContext;
  let user: User;

  beforeEach(() => {
    userRepository = new Repository<User>(User, entityManager);
    adminGuard = new AdminGuard(userRepository);

    user = new User();
    user.id = 1;
    user.firstName = 'firstName';
    user.lastName = 'lastName';
    user.email = 'email@email.com';
    user.role = UserRole.USER;

    validTokenExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as ExecutionContext;

    invalidTokenExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        }),
      }),
    } as ExecutionContext;

    noTokenExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: '',
          },
        }),
      }),
    } as ExecutionContext;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('success', () => {
    it('should return true if the user is admin', async () => {
      jest.spyOn(verifyToken, 'default').mockImplementation(() => { 
        return { id: 1 } as JwtPayload
      });
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);

      user.role = UserRole.ADMIN;

      const result = await adminGuard.canActivate(validTokenExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('No token', () => {
    it('should throw and HttpExeption if there is no token', async () => {
      try {
        await adminGuard.canActivate(noTokenExecutionContext);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.UNAUTHORIZED);
        expect(err.message).toEqual('Auth error - Please provide a token.');
      }
    });
  });

  describe('Invalid token', () => {
    it('should throw and HttpExeption if the token is invalid', async () => {
      try {
        await adminGuard.canActivate(invalidTokenExecutionContext);
      } catch (err) {
        expect(err.message).toEqual('Auth error - Please provide a valid token.');
      }
    });
  });

  describe('User not found', () => {
    it('should throw and HttpExeption if the token user is not found', async () => {
      try {
        jest.spyOn(verifyToken, 'default').mockImplementation(() => { 
          return { id: 1 } as JwtPayload
        });
        jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);
        await adminGuard.canActivate(validTokenExecutionContext);
      } catch (err) {
        expect(err.message).toEqual('Auth error - Please provide a valid token.');
      }
    });
  });

  describe('User is not admin', () => {
    it('should throw and HttpExeption if the user does not have the admin role', async () => {
      try {
        jest.spyOn(verifyToken, 'default').mockImplementation(() => { 
          return { id: 1 } as JwtPayload
        });
        jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);
        await adminGuard.canActivate(validTokenExecutionContext);
      } catch (err) {
        expect(err.message).toEqual(`Auth error - User doesn't have permissions to access this endpoint.`);
      }
    });
  });
});
