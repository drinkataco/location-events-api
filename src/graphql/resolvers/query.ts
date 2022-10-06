import type { Model } from 'mongoose';

import MyContext from '../context';
import orderBy from './order';
import * as Models from '../../db/models';
import * as Types from '../../generated/graphql';

/**
 * Possible arguments for collection filtering
 */
type CollectionArgs = {
  limit: number;
  offset: number;
  filter?: {
    [s: string]: string;
  };
  order?: {
    dir: Types.QueryOrderDir;
    by: Types.QueryOrderFieldEvent;
  };
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
  <T extends object>(model: Model<T>, dataSourceName: string) =>
    async (_: never | undefined, args: CollectionArgs, ctx: MyContext) => {
      // Find documents from data source
      const dataSource =
        ctx.dataSources[dataSourceName as keyof typeof ctx.dataSources];
      let results = (await dataSource.findByFields(
        args.filter || {},
      )) as unknown[] as T[];

      // Order results by a field (or subfield)
      if (args.order?.by) {
        const dir = args.order.dir || Types.QueryOrderDir.Desc;

        if ((args.order.by as string) in orderBy) {
          // Check if we have a specific type of ordering function for this method
          const sortFunc = orderBy[args.order.by as string as keyof typeof orderBy];
          results = results.sort(sortFunc<T>(dir));
        } else {
          // Otherwise we'll use the default sort method
          results = results.sort(orderBy.default<T>(dir, args.order.by as string));
        }
      }

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
    // Collection search functions
    findEvents: getCollection<Types.Event>(Models.Event, 'events'),
    findLocations: getCollection<Types.Location>(Models.Location, 'locations'),
    findOrganisations: getCollection<Types.Organisation>(
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
  // This allows users to find related collections, with the ID being implied
  //
  Organisation: {
    // Find one to one
    location: (event: Types.Event, _: never, ctx: MyContext) =>
      ctx.dataSources.locations.findOneById(event.location),
    // Find one to many
    findEvents: (
      organisation: Types.Organisation,
      args: CollectionArgs,
      ctx: MyContext,
    ) =>
      getCollection<Types.Event>(Models.Event, 'events')(
        undefined,
        { ...args, filter: { organisation: organisation._id } },
        ctx,
      ),
  },
  Event: {
    organisation: (event: Types.Event, _: never, ctx: MyContext) =>
      ctx.dataSources.organisations.findOneById(event.organisation),
    location: (event: Types.Event, _: never, ctx: MyContext) =>
      ctx.dataSources.locations.findOneById(event.location),
  },
  Location: {
    // Find one to many
    findEvents: (
      location: Types.Location,
      args: CollectionArgs,
      ctx: MyContext,
    ) =>
      getCollection<Types.Event>(Models.Event, 'events')(
        undefined,
        { ...args, filter: { location: location._id } },
        ctx,
      ),
    findOrganisations: (
      location: Types.Location,
      args: CollectionArgs,
      ctx: MyContext,
    ) =>
      getCollection<Types.Organisation>(Models.Organisation, 'organisations')(
        undefined,
        { ...args, filter: { location: location._id } },
        ctx,
      ),
  },
};
