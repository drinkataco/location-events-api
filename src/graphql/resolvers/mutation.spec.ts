import { ApolloServer } from 'apollo-server-fastify';

import { typeDefs, resolvers, dataSources } from '..';
import * as db from '../../db/connect';
import * as Models from '../../db/models';
import seed from '../../db/seed';
import * as T from '../../generated/graphql';
import * as Geocode from '../../geocode';

// We're going to use a test apollo instance
let apolloServer!: ApolloServer;
// we'll use a singular id throughout when querying docs. we'll source this after db seed
let eventId!: string;

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

  describe('creates documents', () => {
    it('creates a new Organisation and Location', async () => {
      expect.assertions(5);

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
      /* eslint-disable jest/prefer-strict-equal */
      expect(data.location?.address).toEqual(locationInput.address);
      expect(data.location?._id).toBeDefined();

      // Expect it to have been added to the db
      const organisation = await Models.Organisation.findOne({
        _id: data._id,
      }).exec();
      const location = await Models.Location.findOne({
        _id: data.location?._id,
      }).exec();

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

      mockedGeocode.findAddressFromLatLng.mockResolvedValue(locationInput.address as T.Address);

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

      mockedGeocode.findLatLngFromAddress.mockResolvedValue(
        [
          locationInput.latitude as number,
          locationInput.longitude as number,
        ],
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

  describe('deletes documents', () => {
    let orgId!: string;

    beforeAll(async () => {
      const org = await Models.Organisation.findOne({}).exec();
      orgId = (org as T.Organisation)._id;
    });

    it('throws an error if organisation has undeleted events', async () => {
      expect.assertions(1);

      const result = await apolloServer.executeOperation({
        query: `mutation DeleteOrg($id: ID!) {
          deleteOrganisation(id: $id) {
            success
            _id
          }
        }`,
        variables: {
          id: orgId.toString(),
        },
      });

      expect(result.errors).toBeDefined();
    });

    it('will delete the organisation and force delete events', async () => {
      expect.assertions(2);

      const result = await apolloServer.executeOperation({
        query: `mutation DeleteOrg($id: ID!) {
          deleteOrganisation(id: $id, deleteEvents: true) {
            success
            _id
          }
        }`,
        variables: {
          id: orgId.toString(),
        },
      });

      const org = await Models.Organisation.findOne({ _id: orgId }).exec();
      expect(result.errors).toBeUndefined();
      expect(org).toBeNull();
    });
  });
});
