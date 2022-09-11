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
      (event: Event) => event.organisationId === organisation.id,
    ),
  },
  Event: {
    organisation: (event: Event) => exampleData.organisations.find(
      (organisation: Organisation) => organisation.id === event.organisationId,
    ),
    location: (event: Event) => exampleData.locations.find(
      (location: Location) => location.id === event.locationId,
    ),
  },
  Location: {
    events: (location: Location) => exampleData.events.filter(
      (event: Event) => event.organisationId === location.id,
    ),
  },
};
