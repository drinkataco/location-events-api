import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { FastifyInstance } from 'fastify';

import { NODE_ENV } from './consts';
import typeDefs from './resolvers/types';
import resolvers from './resolvers/query';

/**
 * Plugin to handle graceful closing of webserver
 * @see {@link https://www.fastify.io/docs/latest/Reference/Server/#close}
 *
 * @param fastify - Instance of Fastify Server
 *
 * @returns apollo server plugin
 */
const fastifyAppClosePlugin = (fastify: FastifyInstance): ApolloServerPlugin => ({
  /* eslint-disable @typescript-eslint/require-await */
  serverWillStart: async () => ({
    async drainServer() {
      await fastify.close();
    },
  }),
});

/**
 * Initialise Apollo Server
 *
 * @param fastify - Instance of Fastify Server
 *
 * @returns apollo server instance
 */
export default async (fastify: FastifyInstance): Promise<ApolloServer> => {
  const plugins = [
    fastifyAppClosePlugin(fastify),
    ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
  ];

  if (NODE_ENV === 'local') {
    plugins.push(ApolloServerPluginLandingPageLocalDefault({ embed: true }));
  }

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins,
  });

  await apollo.start();

  return apollo;
};
