import Events from './events';
import { Event as EventModel } from '../../db/schemas';

// console.log('=============>', typeof EventModel)

export default () => ({
  events: new Events(EventModel),
});
