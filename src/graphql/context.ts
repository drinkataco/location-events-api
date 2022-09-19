import type Events from './dataSources/events';
import type Locations from './dataSources/locations';
import type Organisations from './dataSources/organisations';

export default interface MyContext {
  dataSources: {
    events: Events
    locations: Locations
    organisations: Organisations
  }
}
