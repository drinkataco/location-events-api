import mongoose from 'mongoose';

import * as db from './connect';
import { MONGO_URL } from '../consts';
import logger from '../logger';

// Mock Mongoose Connection
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
  },
}));

describe('database connection', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('connects to mongo', async () => {
    expect.assertions(1);

    await db.connect(logger());

    expect(mongoose.connect).toHaveBeenCalledWith(MONGO_URL);
  });

  it('disconnects from mongo', async () => {
    expect.assertions(1);

    await db.disconnect(logger());

    /* eslint-disable @typescript-eslint/unbound-method */
    expect(mongoose.connection.close).toHaveBeenCalledWith();
  });
});
