import pino from 'pino';

import { NODE_ENV } from './consts';

export default (): pino.Logger => {
  const loggerConfig: pino.LoggerOptions = {};

  if (NODE_ENV === 'local') {
    loggerConfig.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    };
  }

  return pino(loggerConfig);
};
