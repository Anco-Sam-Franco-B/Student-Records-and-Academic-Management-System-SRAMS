import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",

  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),

  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: "HH:mm:ss",
        }),
        logFormat
      ),
    }),

    new DailyRotateFile({
      filename: "logs/combined/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
    }),

    new DailyRotateFile({
      filename: "logs/error/%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "60d",
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions/%DATE%.log",
      datePattern: "YYYY-MM-DD",
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
    }),
  ],
});

export default logger;