import Fastify, { FastifyServerOptions } from 'fastify';

import { NODE_ENV, SERVER_PORT, SERVER_HOST } from './consts';

export default async () => {
  const config: FastifyServerOptions = { logger: true };

  if (NODE_ENV === 'local') {
    // If running locally, let's prettify the logs
    config.logger = {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    };
  }

  const fastify = Fastify(config);

  // Set Routes
  fastify.get('/', () => ({ foo: 'bar' }));

  // Listen to Port
  await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });
};
