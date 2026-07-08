import logger from "../config/logger.js";

export default function requestLogger(req, res, next) {
  logger.info(
    `${req.method} ${req.originalUrl} ${req.ip}`
  );

  next();
}