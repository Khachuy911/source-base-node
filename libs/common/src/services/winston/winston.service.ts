import { Injectable, Scope } from '@nestjs/common';
import winstonInstance from './winston.config';
import { ClsService } from 'nestjs-cls';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class WinstonService {
  private prefix?: string;
  private winstonInstance: any;

  constructor(private readonly cls: ClsService) {
    this.winstonInstance = winstonInstance;
  }

  info(message: string, ...args: any[]) {
    this.winstonInstance.info(this.buildMessage(message), ...args);
  }

  error(message: string, ...args: any[]) {
    this.winstonInstance.error(this.buildMessage(message), ...args);
  }

  warn(message: string, ...args: any[]) {
    this.winstonInstance.warn(this.buildMessage(message), ...args);
  }

  debug(message: string, ...args: any[]) {
    this.winstonInstance.debug(this.buildMessage(message), ...args);
  }

  verbose(message: string, ...args: any[]) {
    this.winstonInstance.verbose(this.buildMessage(message), ...args);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  buildMessage(message: string | object) {
    const id = this.cls.getId();
    const requestId = id ? `[Request-ID] ${this.cls.getId()} ` : '';

    if (this.prefix) {
      return `[${this.prefix}] ${requestId} ${message}`;
    }

    return message;
  }
}
