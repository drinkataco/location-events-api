import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import pino from 'pino';

import apolloInstance from './apollo';
import { NODE_ENV, SERVER_PORT, SERVER_HOST } from './consts';

export default async () => {
  const config: FastifyServerOptions = { logger: true };

  if (NODE_ENV === 'local') {
    // If running locally, let's prettify the logs
    config.logger = {
      prettyPrint: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    };
  }

  const fastify: FastifyInstance = Fastify(config);
  const apollo = await apolloInstance(fastify);

  await fastify.register(apollo.createHandler());
  await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });

  (fastify.log as pino.Logger).info(
    `Apollo ready at http://${SERVER_HOST}:${SERVER_PORT}${apollo.graphqlPath}`,
  );
};
