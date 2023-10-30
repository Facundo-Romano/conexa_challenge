import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import throwError from 'src/utils/functions/throwError';
import verifyToken from 'src/utils/functions/verifyToken';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization: string | null = request.headers.authorization;

      if (!authorization || authorization.trim() === '') {
        throwError(responseEstatuses.UNAUTHORIZED, 'Please provide a token.');
      }

      const token = authorization.replace(/bearer/gim, '').trim();

      request.decodedData = verifyToken(token);

      return true;
    } catch (err) {
      throwError(
        err.status || responseEstatuses.ERROR,
        `Auth error - ${err.message}`,
      );
    }
  }
}
