import winston from 'winston';
import path from 'path';
import util from 'util';
import 'winston-daily-rotate-file';

const logDir = path.join(process.cwd(), 'logs');

function transform(info: any): any {
  const args = info[Symbol.for('splat')];
  if (args?.length) {
    info.message = util.format(info.message, ...args);
  }
  return info;
}

function utilFormatter() {
  return { transform };
}
// a custom format that outputs request id
const customFormat = winston.format.printf((info) => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

const winstonConfig = {
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.colorize(),
    utilFormatter(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: '%DATE%.log',
      dirname: logDir,
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '40m',
      maxFiles: '30d',
      zippedArchive: true,
      handleExceptions: true,
    }),
  ],
};

export default winston.createLogger(winstonConfig);
