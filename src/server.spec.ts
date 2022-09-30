import { FastifyInstance } from 'fastify';

import server from './server';

let serverInstance!: FastifyInstance;

describe('the server should start', () => {
  beforeAll(async () => {
    serverInstance = await server();
  });

  afterAll(async () => {
    await serverInstance.close();
  });

  it('should return a 404 for the root', async () => {
    expect.assertions(1);

    const response = await serverInstance.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return a 400 csrf check for the graphql endpoint with empty headers', async () => {
    expect.assertions(2);

    const response = await serverInstance.inject({
      method: 'GET',
      url: '/graphql',
    });

    expect(response.body).toMatch(
      /^This operation has been blocked as a potential Cross-Site Request Forgery/,
    );

    expect(response.statusCode).toBe(400);
  });

  it('should return a 400 for the graphql endpoint with an empty query', async () => {
    expect.assertions(2);

    const response = await serverInstance.inject({
      method: 'GET',
      url: '/graphql',
      headers: {
        'content-type': 'text/json',
      },
    });

    expect(response.body).toBe('GET query missing.');
    expect(response.statusCode).toBe(400);
  });
});
