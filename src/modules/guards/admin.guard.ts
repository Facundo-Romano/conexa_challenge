import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserRole } from 'src/utils/enums/UserRole';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import throwError from 'src/utils/functions/throwError';
import verifyToken from 'src/utils/functions/verifyToken';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization: string | null = request.headers.authorization;

      if (!authorization || authorization.trim() === '') {
        throwError(responseEstatuses.UNAUTHORIZED, 'Please provide a token.');
      }

      const token = authorization.replace(/bearer/gim, '').trim();

      const decodedData = verifyToken(token);

      const user: User = await this.userRepository.findOne({
        where: {
          id: decodedData.id,
        },
      });

      if (!user) {
        throwError(
          responseEstatuses.FORBIDDEN,
          'Please provide a valid token.',
        );
      }

      if (user.role !== UserRole.ADMIN) {
        throwError(
          responseEstatuses.FORBIDDEN,
          `User doesn't have permissions to access this endpoint.`,
        );
      }

      return true;
    } catch (err) {
      throwError(
        err.status,
        `Auth error - ${err.message}`,
      );
    }
  }
}
