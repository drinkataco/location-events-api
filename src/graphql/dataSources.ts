/* eslint-disable max-classes-per-file */
import { MongoDataSource } from 'apollo-datasource-mongodb';

import type { Event, Location, Organisation } from '../generated/graphql';
import * as Models from '../db/schemas';

// These apollo datasources will have effectively the same pattern
class MyDataSource<T> extends MongoDataSource<T> {
  findAll() {
    return this.findByFields({});
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
