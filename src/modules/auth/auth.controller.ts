import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm/entities/User';
import { Response } from 'express';
import RegisterRequest from './interfaces/RegisterRequest';
import LoginRequest from './interfaces/LoginRquest';
import handleResponse from 'src/utils/functions/handleResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() body: RegisterRequest,
  ): Promise<Response> {
    const user: User = await this.authService.register(body);

    return handleResponse<User>([user], 'User created successfully.', res);
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: LoginRequest,
  ): Promise<Response> {
    const token: string = await this.authService.login(body);

    return handleResponse([{ token }], 'LoggedIn successfully.', res);
  }
}
