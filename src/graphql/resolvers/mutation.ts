import * as Types from '../../generated/graphql';
import * as Models from '../../db/models';

/**
 * We can create a location alongside a createEvent and createOrganisation mutation
 *  - so this function is reusable
 *
 * @param location - location with lat/long coords and/or address
 *
 * @returns Location document instance
 */
const insertLocation = async (
  location: Partial<Types.Location>,
): Promise<Types.Location> => {
  const newLocation = location;

  // TODO: If address isn't supplied, we'll make sure to fetch it from Google
  if (!newLocation.address) {
    newLocation.address = {
      line1: 'test',
      city: 'Birmingham',
      postCode: 'B16 8DD',
      country: 'GB',
    };
  }

  const inserted = new Models.Location(newLocation);
  await inserted.save();

  return inserted;
};

export default {
  //
  // Mutations
  //
  Mutation: {
    //
    // CREATE
    //
    createLocation: async (_: never, location: Partial<Types.Location>) => {
      const result = await insertLocation(location);
      return {
        success: true,
        result,
      };
    },

    createOrganisation: async (
      _: never,
      args: {
        organisation: Partial<Types.OrganisationInput>;
        location?: Partial<Types.Location>;
      },
    ) => {
      const { location, organisation } = args;

      // Create and use location if passed through as well
      if (location) {
        const newLocation = await insertLocation(location);
        organisation.location = newLocation._id;
      }

      const result = new Models.Organisation(organisation);
      await result.save();

      return { success: true, result };
    },

    createEvent: async (
      _: never,
      args: {
        event: Partial<Types.EventInput>;
        location?: Partial<Types.Location>;
      },
    ) => {
      const { location, event } = args;

      // Create and use location if passed through as well
      if (location) {
        const newLocation = await insertLocation(location);
        event.location = newLocation._id;
      }

      const result = new Models.Event(event);
      await result.save();

      return { success: true, result };
    },

    //
    // UPDATE
    //
    updateLocation: () => ({ success: true }),
    updateOrganisation: () => ({ success: true }),
    updateEvent: () => ({ success: true }),

    //
    // DELETE
    //
    deleteLocation: () => ({ success: true }),
    deleteOrganisation: () => ({ success: true }),
    deleteEvent: () => ({ success: true }),
  },
};
