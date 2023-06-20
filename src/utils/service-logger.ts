import * as winston from 'winston';
import dailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, prettyPrint } = winston.format;

/**
 * It creates a logger used for information & error tracking
 */
export const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
    new dailyRotateFile({ filename: 'customer-service', level: 'info' }),
  ],
  // to log unhandled errors
  exceptionHandlers: [
    new dailyRotateFile({
      filename: 'customer-service-error',
      level: 'error',
      format: winston.format.errors({ stack: true }),
    }),
  ],
});
