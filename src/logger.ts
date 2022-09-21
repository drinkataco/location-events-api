import pino from 'pino';

import { NODE_ENV, LOG_LEVEL } from './consts';

export default (): pino.Logger => {
  const loggerConfig: pino.LoggerOptions = {
    level: LOG_LEVEL,
  };

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
