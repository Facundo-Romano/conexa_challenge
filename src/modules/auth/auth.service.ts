import { Injectable } from '@nestjs/common';
import RegisterRequest from './interfaces/RegisterRequest';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import LoginRequest from './interfaces/LoginRquest';
import generateJwt from './functions/generateJwt';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import validateRegisterRequest from './functions/validateRegisterRequest';
import validateLoginRequest from 'src/modules/auth/functions/validateLoginRequest';
import throwError from 'src/utils/functions/throwError';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(request: RegisterRequest): Promise<User> {
    validateRegisterRequest(request);

    const userExists: User = await this.userRepository.findOne({
      where: { email: request.email },
    });

    if (userExists)
      throwError(responseEstatuses.CONFLICT, 'Email already in use.');

    const user: User = this.userRepository.create(request);

    user.password = await bcrypt.hash(request.password, 10);

    const newUser: User = await this.userRepository.save(user);

    delete newUser.password;

    return newUser;
  }

  async login(request: LoginRequest): Promise<string> {
    validateLoginRequest(request);

    const user: User = await this.userRepository.findOne({
      where: { email: request.email },
    });

    if (!user)
      throwError(responseEstatuses.BAD_REQUEST, 'Invalid credentials.');

    const isPasswordValid: boolean = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid)
      throwError(responseEstatuses.BAD_REQUEST, 'Invalid credentials.');

    delete user.password;

    return generateJwt({ ...user });
  }
}
