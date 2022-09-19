import { MongoDataSource } from 'apollo-datasource-mongodb';

import { Organisation } from '../../generated/graphql';

export default class Organisations extends MongoDataSource<Organisation> {
  public getOrganisations(): Promise<(Organisation | null | undefined)[]> {
    return this.findByFields({});
  }

  public getOrganisationById(id: string): Promise<Organisation | null | undefined> {
    return this.findOneById(id);
  }
}
