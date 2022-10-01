import { Schema, model } from 'mongoose';

import { Event } from '../../generated/graphql';

const eventSchema = new Schema<Event>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    time: {
      start: { type: Date, required: true },
      end: Date,
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      index: true,
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
    },
  },
  { timestamps: true },
);

export default model<Event>('Event', eventSchema);
