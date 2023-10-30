import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class handleErrorResponse implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}