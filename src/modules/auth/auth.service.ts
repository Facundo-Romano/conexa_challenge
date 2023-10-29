import { Injectable } from '@nestjs/common';
import RegisterRequest from './interfaces/RegisterRequest';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import LoginRequest from './interfaces/LoginRquest';
import generateJwt from './functions/generateJwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(request: RegisterRequest): Promise<User> {
    try {
      const user: User = await this.userRepository.create(request);

      user.password = await bcrypt.hash(request.password, 10);

      const newUser: User = await this.userRepository.save(user);

      delete newUser.password;

      return newUser;
    } catch (e) {
      console.log(e);
    }
  }

  async login(request: LoginRequest): Promise<string> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email: request.email },
      });

      if (!user) {
        console.log('user doesnt exist');
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        request.password,
        user.password,
      );

      if (!isPasswordValid) {
        console.log('invalid password');
      }

      delete user.password;

      return generateJwt({...user});
    } catch (e) {
      console.log(e);
    }
  }
}
