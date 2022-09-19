import { Schema, model } from 'mongoose';

import { Location } from '../../generated/graphql';

const locationSchema = new Schema<Location>(
  {
    address: {
      line1: { type: String, required: true, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      region: { type: String, trim: true },
      postCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true },
);

export default model<Location>('Location', locationSchema);
