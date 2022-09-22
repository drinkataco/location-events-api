import type { Model } from 'mongoose';

import MyContext from './context';
import * as Models from '../db/models';
import * as Types from '../generated/graphql';

/**
 * Possible arguments for collection filtering
 */
type CollectionArgs = {
  limit: number;
  offset: number;
};

/**
 * Helper to get results and metadata for a collection
 *
 * @param model - the mongoose model
 * @param dataSourceName - the name of the datasource we're going to use
 *
 * @returns a function to be called by the query resolver to find in collection
 */
const getCollection =
  <T>(model: Model<T>, dataSourceName: string) =>
    async (_: never, args: CollectionArgs, ctx: MyContext) => {
      const dataSource =
        ctx.dataSources[dataSourceName as keyof typeof ctx.dataSources];
      const results = await dataSource.findAll();
      return {
        meta: {
          total: await model.countDocuments({}),
          offset: args.offset,
          limit: args.limit,
        },
        results: results.slice(args.offset, args.offset + args.limit),
      };
    };

/**
 * Helper a document by id
 *
 * @param dataSourceName - the name of the datasource we're going to use
 *
 * @returns a function to be called by the query resolver to find by id
 */
const getById =
  (dataSourceName: string) =>
    (_: never, args: { id: string }, ctx: MyContext) =>
      ctx.dataSources[dataSourceName as keyof typeof ctx.dataSources].findOneById(
        args.id,
      );

export default {
  //
  // Standard Queries
  //
  Query: {
    // Collections
    events: getCollection<Types.Event>(Models.Event, 'events'),
    locations: getCollection<Types.Location>(Models.Location, 'locations'),
    organisations: getCollection<Types.Organisation>(
      Models.Organisation,
      'organisations',
    ),
    // Objects
    event: getById('events'),
    location: getById('locations'),
    organisation: getById('organisations'),
  },
  //
  // Inverse Lookups
  //
  Organisation: {
    events: (organisation: Types.Organisation, _: never, ctx: MyContext) =>
      ctx.dataSources.events.findByFields({
        organisation_id: organisation._id,
      }),
  },
  Event: {
    organisation: (event: Types.Event, _: never, ctx: MyContext) =>
      ctx.dataSources.organisations.findOneById(event.organisation),
    location: (event: Types.Event, _: never, ctx: MyContext) =>
      ctx.dataSources.locations.findOneById(event.location),
  },
  Location: {
    events: (location: Types.Location, _: never, ctx: MyContext) =>
      ctx.dataSources.events.findByFields({
        location_id: location._id,
      }),
  },
};
