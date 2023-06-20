import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }
    console.error(exception);

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(exception['response']),
      'ExceptionFilter',
    );

    if (/sequelize/i.test(exception['name'])) {
      response.status(status).json({
        ...exception,
      });
    } else
      response.status(status).json({
        ...exception['response'],
      });
  }
}
