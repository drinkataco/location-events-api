import mongoose from 'mongoose';
import pino from 'pino';

import { MONGO_CONNECTION } from '../consts';

export default async (logger: pino.Logger) => {
  await mongoose.connect(MONGO_CONNECTION);

  // Just get basic connection details to print
  const dbName = (MONGO_CONNECTION.split('@')[1] as string).split('?')[0];
  logger.info(`Connected to Mongo Database mongodb://${dbName as string}`);
};
