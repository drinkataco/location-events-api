import { MongoDataSource } from 'apollo-datasource-mongodb';

import { Location } from '../../generated/graphql';

export default class Locations extends MongoDataSource<Location> {
  public getLocations(): Promise<(Location | null | undefined)[]> {
    return this.findByFields({});
  }

  public getLocationById(id: string): Promise<Location | null | undefined> {
    return this.findOneById(id);
  }
}
