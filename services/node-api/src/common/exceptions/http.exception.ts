import { WinstonService } from '@lib/common';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: WinstonService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const response: any = exception instanceof HttpException ? exception.getResponse() : exception;

    let messageError = response.message ? response.message : response;

    let data = {};

    if (typeof messageError === 'object' && !Array.isArray(messageError)) {
      data = messageError.data;
      delete messageError.data;
      messageError = messageError.responseMessage;
    }

    this.logger.error(`error`, messageError);

    const responseBody = {
      message: messageError,
      statusCode: httpStatus,
      success: false,
      data,
      requestDate: new Date(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
