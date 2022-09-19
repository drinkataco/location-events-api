import { Schema, model } from 'mongoose';

import { Organisation } from '../../generated/graphql';

const orgSchema = new Schema<Organisation>(
  {
    name: { type: String, required: true, trim: true },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<Organisation>('Organisation', orgSchema);
