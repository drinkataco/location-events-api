import { MongoDataSource } from 'apollo-datasource-mongodb';

import { Event } from '../../generated/graphql';

export default class Events extends MongoDataSource<Event> {
  public getEvents(): Promise<(Event | null | undefined)[]> {
    return this.findByFields({});
  }

  public getEventById(id: string): Promise<Event | null | undefined> {
    return this.findOneById(id);
  }

  public findOneById(id: unknown) {
    return super.findOneById(id as string);
  }
}
