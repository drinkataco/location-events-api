import { Schema, model } from 'mongoose';

import { Organisation } from '../../generated/graphql';

const orgSchema = new Schema<Organisation>({
  title: { type: String, required: true },
});

export default model<Organisation>('Organisation', orgSchema);
