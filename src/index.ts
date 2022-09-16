import dbConnect from './db';
import loggerInstance from './logger';
import createServer from './server';

// Initialise Logger
const logger = loggerInstance();

// Create web serviver for graphql
createServer(logger).catch((err) => {
  logger.error(err, 'Error Starting Server');
  process.exit(1);
});

// Create Mongo DB Connection
dbConnect(logger).catch((err) => {
  logger.error(err, 'Error Connecting to Database');
  process.exit(1);
});

// Ensure SIGINT exists application
process.on('SIGINT', () => {
  process.exit();
});
