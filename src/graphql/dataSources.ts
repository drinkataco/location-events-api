/* eslint-disable max-classes-per-file */
import { MongoDataSource } from 'apollo-datasource-mongodb';

import type { Event, Location, Organisation } from '../generated/graphql';
import * as Models from '../db/models';

// These apollo datasources will have effectively the same pattern
export class MyDataSource<T> extends MongoDataSource<T> {
  /**
   * This allows us to grab ObjectIds from GraphQL types
   */
  public findOneById(id: unknown) {
    return super.findOneById(id as string);
  }
}

export class Events extends MyDataSource<Event> {}
export class Locations extends MyDataSource<Location> {}
export class Organisations extends MyDataSource<Organisation> {}

export default () => ({
  events: new Events(Models.Event),
  locations: new Locations(Models.Location),
  organisations: new Organisations(Models.Organisation),
});
