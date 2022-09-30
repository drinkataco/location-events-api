import { MongoDataSource } from 'apollo-datasource-mongodb';

import dataSources from './dataSources';

const sources = dataSources();

describe('dataSources spec', () => {
  it('contains datasources for all collections', () => {
    expect.assertions(4);

    expect(Object.keys(sources)).toHaveLength(3);
    expect(sources.events).toBeInstanceOf(MongoDataSource);
    expect(sources.locations).toBeInstanceOf(MongoDataSource);
    expect(sources.organisations).toBeInstanceOf(MongoDataSource);
  });
});
