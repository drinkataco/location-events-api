import * as exampleData from './_data';
import { Event, Location, Organisation } from '../generated/graphql';

export default {
  //
  // Standard Queries
  //
  Query: {
    organisations: () => exampleData.organisations,
    events: () => exampleData.events,
    locations: () => exampleData.locations,
  },
  //
  // Inverse Lookups
  //
  Organisation: {
    events: (organisation: Organisation) => exampleData.events.filter(
      (event: Event) => event.organisation_id === organisation._id,
    ),
  },
  Event: {
    organisation: (event: Event) => exampleData.organisations.find(
      (organisation: Organisation) => organisation._id === event.organisation_id,
    ),
    location: (event: Event) => exampleData.locations.find(
      (location: Location) => location._id === event.location_id,
    ),
  },
  Location: {
    events: (location: Location) => exampleData.events.filter(
      (event: Event) => event.location_id === location._id,
    ),
  },
};
