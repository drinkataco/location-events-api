import * as exampleData from './_data';

export default {
  Query: {
    organisations: () => exampleData.organisations,
    events: () => exampleData.events,
    locations: () => exampleData.locations,
  },
  Organisation: {
    events: () => ([{ id: 'z' }]),
  },
  Event: {
    organisation: () => ({ id: 'x' }),
    location: () => ({ id: 'y' }),
  },
  Location: {
    events: () => ([{ id: 'z' }]),
  },
};
