import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, splat, json } = winston.format;

const logDir = path.resolve(process.cwd(), 'logs');

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${ts}] ${level}: ${stack || message}${metaStr}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    splat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' })
  ),
  defaultMeta: { service: 'playwright-tests' },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss.SSS' }),
        consoleFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: json(),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: json(),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

export default logger;
