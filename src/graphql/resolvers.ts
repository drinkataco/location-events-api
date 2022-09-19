import MyContext from './context';
import { Event, Location, Organisation } from '../generated/graphql';

export default {
  //
  // Standard Queries
  //
  Query: {
    organisations: (_: never, __: never, ctx: MyContext) =>
      ctx.dataSources.organisations.findAll(),
    events: (_: never, __: never, ctx: MyContext) =>
      ctx.dataSources.events.findAll(),
    locations: (_: never, __: never, ctx: MyContext) =>
      ctx.dataSources.locations.findAll(),
  },
  //
  // Inverse Lookups
  //
  Organisation: {
    events: (organisation: Organisation, _: never, ctx: MyContext) =>
      ctx.dataSources.events.findByFields({
        organisation_id: organisation._id,
      }),
  },
  Event: {
    organisation: (event: Event, _: never, ctx: MyContext) =>
      ctx.dataSources.organisations.findOneById(event.organisation),
    location: (event: Event, _: never, ctx: MyContext) =>
      ctx.dataSources.locations.findOneById(event.location),
  },
  Location: {
    events: (location: Location, _: never, ctx: MyContext) =>
      ctx.dataSources.events.findByFields({
        location_id: location._id,
      }),
  },
};
