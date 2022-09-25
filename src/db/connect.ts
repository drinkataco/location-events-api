import mongoose from 'mongoose';
import pino from 'pino';

import { MONGO_CONNECTION } from '../consts';

export const connect = async (logger: pino.Logger) => {
  await mongoose.connect(MONGO_CONNECTION);

  // Just get basic connection details to print
  const dbName = (MONGO_CONNECTION.split('@')?.[1] as string)?.split('?')[0];
  logger.info(`Connected to Mongo Database mongodb://${dbName as string}`);
};

export const disconnect = async (logger: pino.Logger) => {
  await mongoose.connection.close();
  logger.info('Disconnected from Mongo');
};
