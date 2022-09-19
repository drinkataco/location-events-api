import Events from './events';
import Locations from './locations';
import Organisations from './organisations';
import {
  Event as EventModel,
  Location as LocationModel,
  Organisation as OrganisationModel,
} from '../../db/schemas';

export default () => ({
  events: new Events(EventModel),
  locations: new Locations(LocationModel),
  organisations: new Organisations(OrganisationModel),
});
