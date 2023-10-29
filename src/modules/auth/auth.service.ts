import { Injectable } from '@nestjs/common';
import RegisterRequest from './interfaces/RegisterRequest';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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
      
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e)
    }
  }

  login(): string {
    return 'Login';
  }
}
