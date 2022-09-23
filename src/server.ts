import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import pino from 'pino';

import apolloInstance from './apollo';
import { SERVER_PORT, SERVER_HOST } from './consts';

export default async (logger: pino.Logger): Promise<FastifyInstance> => {
  const config: FastifyServerOptions = { logger };

  const fastify: FastifyInstance = Fastify(config);
  const apollo = await apolloInstance(fastify);

  await fastify.register(apollo.createHandler());
  await fastify.listen({ port: SERVER_PORT, host: SERVER_HOST });

  (fastify.log as pino.Logger).info(
    `Apollo ready at http://${SERVER_HOST}:${SERVER_PORT}${apollo.graphqlPath}`,
  );

  return fastify;
};
