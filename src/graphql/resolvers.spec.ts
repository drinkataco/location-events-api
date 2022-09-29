import { ApolloServer } from 'apollo-server-fastify';

import { typeDefs, resolvers, dataSources } from '.';
import * as Models from '../db/models';
import * as db from '../db/connect';
import seed from '../db/seed';
import * as T from '../generated/graphql';

// We're going to use a test apollo instance
let apolloServer!: ApolloServer;
// we'll use a singular id throughout when querying docs. we'll source this after db seed
let eventId!: string;

describe('graphql resolvers', () => {
  beforeAll(async () => {
    await db.connect();

    // we'll use the seed script to add some test records
    await Promise.all(seed(4));

    apolloServer = new ApolloServer({
      dataSources,
      typeDefs,
      resolvers,
    });

    const event = await Models.Event.findOne({}).exec();
    eventId = (event as T.Event)._id;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should get and return a collection with a limit', async () => {
    expect.assertions(4);

    const result = await apolloServer.executeOperation({
      query: `query myQuery($limit: Int) {
        findEvents(limit: $limit) {
          meta {
            total
            limit
            offset
          }
          results {
            _id
            name
            description
          }
        }
      }`,
      variables: { limit: 2 },
    });

    const data = result.data as T.Query;
    expect(result.errors).toBeUndefined();
    expect(data.findEvents?.meta).toMatchObject({
      total: 4,
      limit: 2,
      offset: 0,
    });
    expect(data.findEvents?.results).toHaveLength(2);
    expect(data.findEvents?.results[0]).toMatchObject({
      _id: expect.any(String) as string,
      name: expect.any(String) as string,
      description: expect.any(String) as string,
    } as T.Event);
  });

  it('should get and return a collection with a limit and offset', async () => {
    expect.assertions(4);

    const result = await apolloServer.executeOperation({
      query: `query myQuery($limit: Int, $offset: Int) {
        findEvents(limit: $limit, offset: $offset) {
          meta {
            total
            limit
            offset
          }
          results {
            _id
            name
            description
          }
        }
      }`,
      variables: { limit: 2, offset: 2 },
    });

    const data = result.data as T.Query;
    expect(result.errors).toBeUndefined();
    expect(data.findEvents?.meta).toMatchObject({
      total: 4,
      limit: 2,
      offset: 2,
    });
    expect(data.findEvents?.results).toHaveLength(2);
    expect(data.findEvents?.results[0]).toMatchObject({
      _id: expect.any(String) as string,
      name: expect.any(String) as string,
      description: expect.any(String) as string,
    } as T.Event);
  });

  it('should get a document by ID', async () => {
    expect.assertions(2);

    const result = await apolloServer.executeOperation({
      query: `query {
        event(id: "${eventId}") {
          _id,
          name,
          description,
          time {
            start
            end
          }
        }
      }`,
    });

    const event = result.data?.event as T.Event;

    expect(result.errors).toBeUndefined();
    expect(event).toMatchObject({
      _id: expect.any(String) as string,
      name: expect.any(String) as string,
      description: expect.any(String) as string,
      time: {
        start: expect.any(Date) as Date,
      },
    } as T.Event);
  });

  it('should get a related document', async () => {
    expect.assertions(2);

    const result = await apolloServer.executeOperation({
      query: `query {
        event(id: "${eventId}") {
          _id,
          organisation {
            name
          }
        }
      }`,
    });

    const event = result.data?.event as T.Event;

    expect(result.errors).toBeUndefined();
    expect(event).toMatchObject({
      _id: expect.any(String) as string,
      organisation: {
        name: expect.any(String) as string,
      },
    } as T.Event);
  });

  it('should get a related collection', async () => {
    expect.assertions(2);

    const organisation = await Models.Organisation.findOne({}).exec();
    const organisationId = (organisation as T.Organisation)._id;

    const result = await apolloServer.executeOperation({
      query: `query {
        organisation(id: "${organisationId}") {
          _id,
          name
          findEvents {
            results {
              name
              description
            }
          }
        }
      }`,
    });

    const org = result.data?.organisation as T.Organisation;

    expect(result.errors).toBeUndefined();
    expect(org).toMatchObject({
      _id: expect.any(String) as string,
      name: expect.any(String) as string,
      findEvents: {
        results: expect.arrayContaining([{
          name: expect.any(String) as string,
          description: expect.any(String) as string,
        }]) as T.Event[],
      },
    } as T.Organisation);
  });
});
