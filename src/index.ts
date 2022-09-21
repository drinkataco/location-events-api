import * as db from './db/connect';
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
db.connect(logger).catch((err) => {
  logger.error(err, 'Error Connecting to Database');
  process.exit(1);
});

// Ensure SIGINT exists application
// and handle gracefully
process.on('SIGINT', () => {
  db.disconnect(logger)
    .then(() => process.exit())
    .catch((err) => {
      logger.error(
        err,
        'There was an error gracefully disconnecting from the database',
      );
    });
});
