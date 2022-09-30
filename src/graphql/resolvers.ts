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
  fields?: {
    [s: string]: string,
  },
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
    async (_: never | undefined, args: CollectionArgs, ctx: MyContext) => {
      const dataSource =
      ctx.dataSources[dataSourceName as keyof typeof ctx.dataSources];
      const results = await dataSource.findByFields(args.fields || {});
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
        { ...args, fields: { organisation: organisation._id } },
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
        { ...args, fields: { location: location._id } },
        ctx,
      ),
    findOrganisations: (
      location: Types.Location,
      args: CollectionArgs,
      ctx: MyContext,
    ) =>
      getCollection<Types.Organisation>(Models.Organisation, 'organisations')(
        undefined,
        { ...args, fields: { location: location._id } },
        ctx,
      ),
  },
};
