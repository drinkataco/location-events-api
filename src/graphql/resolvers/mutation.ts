import { UpdateQuery } from 'mongoose';

import MyContext from '../context';
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
    updateOrganisation: async (
      _: never,
      args: {
        id: string;
        organisation: Partial<Types.Organisation>;
      },
      ctx: MyContext,
    ) => {
      await Models.Organisation.updateOne(
        { _id: args.id },
        args.organisation as UpdateQuery<Types.Organisation>,
      );

      // Remove from cache too
      await ctx.dataSources.organisations.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },
    updateLocation: async (
      _: never,
      args: {
        id: string;
        location: Partial<Types.Location>;
      },
      ctx: MyContext,
    ) => {
      await Models.Location.updateOne(
        { _id: args.id },
        args.location as UpdateQuery<Types.Location>,
      );

      // Remove from cache too
      await ctx.dataSources.locations.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },
    updateEvent: async (
      _: never,
      args: {
        id: string;
        event: Partial<Types.Event>;
      },
      ctx: MyContext,
    ) => {
      await Models.Event.updateOne(
        { _id: args.id },
        args.event as UpdateQuery<Types.Event>,
      );

      // Remove from cache too
      await ctx.dataSources.events.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },

    //
    // DELETE
    //
    deleteOrganisation: async (
      _: never,
      args: {
        id: string;
        deleteEvents: boolean;
      },
      ctx: MyContext,
    ) => {
      if (args.deleteEvents) {
        // If user has selected deleteEvents, we'll force delete them
        await Models.Event.deleteMany({
          organisation: args.id,
          __typename: 'Event',
        });
        await ctx.dataSources.organisations.deleteFromCacheByFields({
          organisation: args.id,
        });
      } else {
        // Otherwise we'll check if there's any children knocking about
        const events = await ctx.dataSources.events.findByFields({
          organisation: args.id,
        });

        if (events) {
          throw Error(
            'Organisation has events belonging to it. Delete them with deleteEvents: true',
          );
        }
      }

      const result = await Models.Organisation.deleteOne({
        _id: args.id,
        __typename: 'Organisation',
      });

      if (!result.deletedCount) {
        throw Error(`Error deleting Location with ID ${args.id}`);
      }

      // Remove from cache too
      await ctx.dataSources.organisations.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },
    deleteLocation: async (
      _: never,
      args: {
        id: string;
      },
      ctx: MyContext,
    ) => {
      const result = await Models.Location.deleteOne({
        _id: args.id,
        __typename: 'Location',
      });

      if (!result.deletedCount) {
        throw Error(`Error deleting Location with ID ${args.id}`);
      }

      const relatedField = { _id: args.id };
      const relations = await Promise.all([
        ctx.dataSources.events.findByFields(relatedField),
        ctx.dataSources.organisations.findByFields(relatedField),
      ]);

      if (relations) {
        throw Error('Clean up location relations before deleting');
      }

      // Remove from cache too
      await ctx.dataSources.locations.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },
    deleteEvent: async (
      _: never,
      args: {
        id: string;
      },
      ctx: MyContext,
    ) => {
      const result = await Models.Event.deleteOne({
        _id: args.id,
        __typename: 'Event',
      });

      if (!result.deletedCount) {
        throw Error(`Error deleting Event with ID ${args.id}`);
      }

      // Remove from cache too
      await ctx.dataSources.events.deleteFromCacheById(args.id);

      return { success: true, _id: args.id };
    },
  },
};
