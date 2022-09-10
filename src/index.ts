import createServer from './server';

createServer().catch((err) => {
  /* eslint-disable no-console */
  console.log('Error Starting Application\n', err);
  process.exit(1);
});

// Ensure SIGINT exists application
process.on('SIGINT', () => {
  process.exit();
});
