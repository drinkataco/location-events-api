/* eslint-disable prefer-destructuring */
import * as dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

// Fastify Server Config (https://www.fastify.io/docs/latest/Reference/Server/)
export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
