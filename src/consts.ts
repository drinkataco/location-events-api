/* eslint-disable prefer-destructuring */
import * as dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

// Default pino log level. @see https://github.com/pinojs/pino/blob/master/docs/api.md#level-string
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Fastify Server Config (https://www.fastify.io/docs/latest/Reference/Server/)
export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';

// Mongo DB Connection
export const MONGO_URL = process.env.MONGO_URL;
