import { Schema, model } from 'mongoose';

import { Location } from '../../generated/graphql';

const locationSchema = new Schema<Location>({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  postCode: { type: String, required: true },
  country: { type: String },
});

export default model<Location>('Location', locationSchema);
