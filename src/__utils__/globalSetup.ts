import { MongoMemoryServer } from 'mongodb-memory-server';

export = async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  /* eslint-disable */
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URL = `${uri.slice(0, uri.lastIndexOf('/'))}/test-db`;
};
