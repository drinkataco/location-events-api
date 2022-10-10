import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  Config,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { FastifyInstance } from 'fastify';
import Keyv from 'keyv';

import { REDIS_URL } from './consts';
import { dataSources, resolvers, typeDefs } from './graphql';

/**
 * Plugin to handle graceful closing of webserver
 * @see {@link https://www.fastify.io/docs/latest/Reference/Server/#close}
 *
 * @param fastify - Instance of Fastify Server
 *
 * @returns apollo server plugin
 */
const fastifyAppClosePlugin = (
  fastify: FastifyInstance,
): ApolloServerPlugin => ({
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
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ];

  const config: Config = {
    dataSources,
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins,
  };

  if (REDIS_URL) {
    // Add Redis Cache if URL set
    config.cache = new KeyvAdapter(new Keyv(REDIS_URL));
  } else {
    config.cache = 'bounded';
  }

  const apollo = new ApolloServer(config);

  await apollo.start();

  return apollo;
};
