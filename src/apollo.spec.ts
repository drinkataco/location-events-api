import Fastify from 'fastify';

import apollo from './apollo';

describe('apollo graphql server should start', () => {
  it('should close the fastify server when apollo closed', async () => {
    expect.assertions(1);
    const fastifyInstance = Fastify({});
    const spy = jest.spyOn(fastifyInstance, 'close');

    const apolloServer = await apollo(fastifyInstance);
    await apolloServer.stop();

    expect(spy).toHaveBeenCalledWith();
  });
});
