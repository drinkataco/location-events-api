import { ApolloServer } from 'apollo-server-fastify';

import { typeDefs, resolvers, dataSources } from '..';
import * as Models from '../../db/models';
import * as db from '../../db/connect';
import seed from '../../db/seed';
import * as T from '../../generated/graphql';
import * as Geocode from '../../geocode';

// We're going to use a test apollo instance
let apolloServer!: ApolloServer;
// we'll use a singular id throughout when querying docs. we'll source this after db seed
let eventId!: string;

// const findAddressFromLatLng = jest.fn();

jest.mock('../../geocode', () => ({
  findAddressFromLatLng: jest.fn(),
  findLatLngFromAddress: jest.fn(),
}));

const mockedGeocode = Geocode as jest.Mocked<typeof Geocode>;

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

  describe('query resolvers', () => {
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
        query: `query($eventId: ID!) {
          event(id: $eventId) {
            _id,
            name,
            description,
            time {
              start
              end
            }
          }
        }`,
        variables: { eventId: eventId.toString() },
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
          results: expect.arrayContaining([
            {
              name: expect.any(String) as string,
              description: expect.any(String) as string,
            },
          ]) as T.Event[],
        },
      } as T.Organisation);
    });
  });

  describe('creates documents', () => {
    it('creates a new Organisation and Location', async () => {
      expect.assertions(8);

      const locationInput: T.LocationInput = {
        address: {
          line1: '600 Metropolitan Ave',
          line2: 'Brooklyn',
          city: 'New York City',
          region: 'New York',
          postCode: '112211',
          country: 'USA',
        },
        latitude: 40.713951,
        longitude: -73.948925,
      };

      const result = await apolloServer.executeOperation({
        query: `mutation CreateOrganisation($location: LocationInput) {
            createOrganisation(
              organisation: { name: "Crocodile Events" }
              location: $location
            ) {
              success
              result {
                _id
                name
                location {
                  _id
                  address {
                    line1
                    line2
                    city
                    region
                    postCode
                    country
                  }
                  latitude
                  longitude
                }
              }
            }
          }
        `,
        variables: { location: locationInput },
      });

      // Expect response to be on board
      const response = result.data
        ?.createOrganisation as T.MutationOrganisationResult;
      const data = response.result as T.Organisation;

      expect(result.errors).toBeUndefined();
      expect(data._id).toBeDefined();
      expect(data.location?.address).toEqual(locationInput.address);
      expect(data.location?._id).toBeDefined();

      // Expect it to have been added to the db
      const organisation = await Models.Organisation.findOne({
        _id: data._id,
      }).exec();
      const location = await Models.Location.findOne({
        _id: data.location?._id,
      }).exec();

      expect(organisation).not.toBeNull();
      expect(location).not.toBeNull();
      expect(organisation?._id.toString()).toBe(data._id);
      expect(location?._id.toString()).toStrictEqual(data.location?._id);
    });

    it('creates a new Organisation with an existing Location', async () => {
      expect.assertions(3);

      const location = await Models.Location.findOne({}).exec();

      const result = await apolloServer.executeOperation({
        query: `mutation CreateOrganisation($locationId: ID) {
            createOrganisation(
              organisation: { name: "Crocodile Events", location: $locationId}
            ) {
              success
              result {
                _id
                name
                location {
                  _id
                }
              }
            }
          }
        `,
        variables: { locationId: location?._id.toString() },
      });

      // Expect response to be on board
      const response = result.data
        ?.createOrganisation as T.MutationOrganisationResult;
      const data = response.result as T.Organisation;

      expect(result.errors).toBeUndefined();
      expect(data._id).toBeDefined();
      expect(data.location?._id).toStrictEqual(location?._id.toString());
    });

    it('fails creating an Event when missing required fields', async () => {
      expect.assertions(1);

      const result = await apolloServer.executeOperation({
        query: `mutation CreateOrganisation {
            createEvent(
              event: { name: "Crocodile Events" }
            ) {
              success
              result {
                _id
              }
            }
          }
        `,
      });

      expect(result.errors).toBeDefined();
    });
  });

  describe('location fields set from api if partially provided', () => {
    const locationInput: T.LocationInput = {
      address: {
        line1: '600 Metropolitan Ave',
        line2: 'Brooklyn',
        city: 'New York City',
        region: 'New York',
        postCode: '112211',
        country: 'USA',
      },
      latitude: 40.713951,
      longitude: -73.948925,
    };

    const locationQuery = `mutation CreateLocation($location: LocationInput!) {
        createLocation(
          location: $location
        ) {
          success
          result {
            _id
          }
        }
      }
    `;

    it('does not call a service if latlong and address provided', async () => {
      expect.assertions(3);

      const result = await apolloServer.executeOperation({
        query: locationQuery,
        variables: { location: locationInput },
      });

      // Expect response to be on board
      const response = result.data?.createLocation as T.MutationLocationResult;
      const data = response.result;

      expect(result.errors).toBeUndefined();
      expect(data?._id).toBeDefined();
      expect(Geocode.findAddressFromLatLng).not.toHaveBeenCalled();
    });

    it('finds an address when latlong provided but no address', async () => {
      expect.assertions(3);

      const locationInputNoAddress: T.LocationInput = {
        latitude: locationInput.latitude,
        longitude: locationInput.longitude,
      };

      mockedGeocode.findAddressFromLatLng.mockReturnValue(
        Promise.resolve(locationInput.address as T.Address),
      );

      const result = await apolloServer.executeOperation({
        query: locationQuery,
        variables: { location: locationInputNoAddress },
      });

      // Expect response to be on board
      const response = result.data?.createLocation as T.MutationLocationResult;
      const data = response.result;

      expect(result.errors).toBeUndefined();
      expect(data?._id).toBeDefined();
      expect(Geocode.findAddressFromLatLng).toHaveBeenCalledWith(
        locationInput.latitude,
        locationInput.longitude,
      );
    });

    it('finds latlong when address but no latlong values', async () => {
      expect.assertions(3);

      const locationInputNoLatLng: T.LocationInput = {
        address: locationInput.address,
      };

      mockedGeocode.findLatLngFromAddress.mockReturnValue(
        Promise.resolve([
          locationInput.latitude as number,
          locationInput.longitude as number,
        ]),
      );

      const result = await apolloServer.executeOperation({
        query: locationQuery,
        variables: { location: locationInputNoLatLng },
      });

      // Expect response to be on board
      const response = result.data?.createLocation as T.MutationLocationResult;
      const data = response.result;

      expect(result.errors).toBeUndefined();
      expect(data?._id).toBeDefined();
      expect(Geocode.findLatLngFromAddress).toHaveBeenCalledWith(
        locationInput.address,
      );
    });

    it('throws an error if lat long and address values have not been set', async () => {
      expect.assertions(1);

      const result = await apolloServer.executeOperation({
        query: locationQuery,
        variables: { location: {} },
      });

      expect(result.errors).toMatchInlineSnapshot(`
        [
          [GraphQLError: Require lat/long or address for location],
        ]
      `);
    });
  });

  describe('updates documents', () => {
    it('updates a document', async () => {
      expect.assertions(1);

      const result = await apolloServer.executeOperation({
        query: `mutation UpdateEvent($id: ID!, $event: EventInputUpdate!) {
          updateEvent(id: $id, event: $event) {
            success
            _id
          }
        }`,
        variables: {
          id: eventId.toString(),
          event: { description: 'this is my updated description' },
        },
      });

      expect(result).toMatchObject({
        data: {
          updateEvent: {
            _id: eventId.toString(),
            success: true,
          },
        },
        errors: undefined,
      });
    });

    it('throws an error if a document not found attempted to update', async () => {
      expect.assertions(1);

      const result = await apolloServer.executeOperation({
        query: `mutation UpdateEvent($id: ID!, $event: EventInputUpdate!) {
          updateEvent(id: $id, event: $event) {
            success
            _id
          }
        }`,
        variables: {
          id: 'bleugh',
          event: { description: 'this is my updated description' },
        },
      });

      expect(result.errors).toBeDefined();
    });
  });
});
