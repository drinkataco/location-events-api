/* eslint-disable prefer-destructuring */
import * as dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

// Server Port
export const PORT = process.env.PORT || 4000;
