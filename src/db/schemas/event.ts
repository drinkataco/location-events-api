import { Schema, model } from 'mongoose';

import { Event } from '../../generated/graphql';

const eventSchema = new Schema<Event>({
  title: { type: String, required: true },
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
    required: true,
  },
});

export default model<Event>('Event', eventSchema);
