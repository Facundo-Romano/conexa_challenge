import { Controller, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm/entities/User';
import { responseEstatuses } from 'src/enums/responseStatuses';
import { Response } from 'express';
import RegisterRequest from './interfaces/RegisterRequest';
import LoginRequest from './interfaces/LoginRquest';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() body: RegisterRequest,
  ): Promise<Response> {
    const user: User = await this.authService.register(body);

    return res
      .status(responseEstatuses.SUCESS)
      .json({ message: 'User created successfully', results: [user] });
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: LoginRequest,
  ): Promise<Response> {
    const token: string = await this.authService.login(body);

    return res
      .status(responseEstatuses.SUCESS)
      .json({ message: 'LoggedIn successfully', results: [{ token }] });
  }
}
