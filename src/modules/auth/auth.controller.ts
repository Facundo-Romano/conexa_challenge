import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm/entities/User';
import { Response } from 'express';
import RegisterRequest from './interfaces/RegisterRequest';
import LoginRequest from './interfaces/LoginRquest';
import handleErrorResponse from 'src/functions/handleErrorResponse';
import handleResponse from 'src/functions/handleResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() body: RegisterRequest,
  ): Promise<Response> {
    try {
      const user: User = await this.authService.register(body);

      return handleResponse<User>([user], 'User created successfully', res);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: LoginRequest,
  ): Promise<Response> {
    try {
      const token: string = await this.authService.login(body);

      return handleResponse([{ token }], 'LoggedIn successfully', res);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }
}
