import { ExecutionContext } from '@nestjs/common';
import { UserGuard } from 'src/modules/guards/user.guard';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import * as verifyToken from 'src/utils/functions/verifyToken';

describe('UserGuard', () => {
  let userGuard: UserGuard;
  let validTokenExecutionContext: ExecutionContext;
  let invalidTokenExecutionContext: ExecutionContext;
  let noTokenExecutionContext: ExecutionContext;

  beforeEach(() => {
    userGuard = new UserGuard();

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
    it('should return true if the token is valid', async () => {
      jest.spyOn(verifyToken, 'default').mockImplementation();
      const result = userGuard.canActivate(validTokenExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('No token', () => {
    it('should throw and HttpExeption if there is no token', async () => {
      try {
        userGuard.canActivate(noTokenExecutionContext);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.UNAUTHORIZED);
        expect(err.message).toEqual('Auth error - Please provide a token.');
      }
    });
  });

  describe('Invalid token', () => {
    it('should throw and HttpExeption if the token is invalid', async () => {
      try {
        userGuard.canActivate(invalidTokenExecutionContext);
      } catch (err) {
        expect(err.message).toEqual('Auth error - Please provide a valid token.');
      }
    });
  });
});
