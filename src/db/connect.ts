import mongoose from 'mongoose';
import pino from 'pino';

import { MONGO_URL } from '../consts';

export const connect = async (logger?: pino.Logger) => {
  await mongoose.connect(MONGO_URL);

  // Just get connection details (without username and password) to print
  if (logger) {
    const dbName = MONGO_URL.includes('@')
      ? `mongodb://${
        (MONGO_URL.split('@')?.[1] as string)?.split('?')[0] as string
      }`
      : MONGO_URL;
    logger.info(`Connected to Mongo Database ${dbName}`);
  }
};

export const disconnect = async (logger?: pino.Logger) => {
  await mongoose.connection.close();
  if (logger) logger.info('Disconnected from Mongo');
};
