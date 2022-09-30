import pino from 'pino';

import logger from './logger';

// Mock pino so we can spy on its construction
jest.mock('pino');
const mocked = pino as jest.Mocked<typeof pino>;

const envVal = jest.fn();
jest.mock('./consts', () => ({
  ...process.env,
  get NODE_ENV(): string {
    return envVal() as string;
  },
}));

describe('logger instantiation', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('generates a logger', () => {
    expect.assertions(1);

    envVal.mockReturnValue('test');

    logger();

    expect(mocked).toHaveBeenCalledWith({ level: 'silent' });
  });

  it('generates a logger with pretty print for local dev', () => {
    expect.assertions(1);

    envVal.mockReturnValue('local');

    logger();

    expect(mocked).toHaveBeenCalledWith({
      level: 'silent',
      transport: { target: 'pino-pretty', options: { colorize: true } },
    });
  });
});
