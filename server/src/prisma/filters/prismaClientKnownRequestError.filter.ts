import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'P2002') {
      const target = exception.meta?.target ?? 'unknown_field';

      return response.status(409).json({
        statusCode: 409,
        message: `${target} unique constraint failed on`,
        error: 'Conflict',
      });
    } else {
      return response.status(500).json({
        statusCode: 500,
        message: 'Something went wrong',
      });
    }
  }
}
