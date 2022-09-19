import type { Events, Locations, Organisations } from './dataSources';

export default interface MyContext {
  dataSources: {
    events: Events
    locations: Locations,
    organisations: Organisations,
  }
}
