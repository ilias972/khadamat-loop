import logger from "@config/logger";

class LoggerService {
        info(message: string, meta?: unknown) {
                logger.info(message, meta);
        }

        warn(message: string, meta?: unknown) {
                logger.warn(message, meta);
        }

        error(message: string, meta?: unknown) {
                logger.error(message, meta);
        }

        debug(message: string, meta?: unknown) {
                logger.debug(message, meta);
        }
}

export const loggerService = new LoggerService();

export default loggerService;
