import * as Models from '../../db/models';
import * as Types from '../../generated/graphql';
import * as Geocode from '../../geocode';

/**
 * We can create a location alongside a createEvent and createOrganisation mutation
 *  - so this function is reusable
 *
 * @param location - location with lat/long coords and/or address
 *
 * @returns Location document instance
 */
const insertLocation = async (
  location: Partial<Types.LocationInput>,
): Promise<Types.Location> => {
  const newLocation = location;

  if (
    (!newLocation.latitude || !newLocation.longitude) &&
    !newLocation.address
  ) {
    throw Error('Require lat/long or address for location');
  }

  // If a latlng has been supplied but no address, fetch the address
  if (!newLocation.address && newLocation.latitude && newLocation.longitude) {
    newLocation.address = await Geocode.findAddressFromLatLng(
      newLocation.latitude,
      newLocation.longitude,
    );
  }

  // If an address has been supplied, but no latlng, fetch latlng
  if (newLocation.address && !newLocation.latitude && !newLocation.longitude) {
    const latLng = await Geocode.findLatLngFromAddress(newLocation.address);
    [newLocation.latitude, newLocation.longitude] = latLng;
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
    createLocation: async (
      _: never,
      args: { location: Partial<Types.Location> },
    ) => {
      const result = await insertLocation(args.location);
      return {
        success: true,
        result,
      };
    },

    createOrganisation: async (
      _: never,
      args: {
        organisation: Partial<Types.OrganisationInput>;
        location?: Partial<Types.LocationInput>;
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
