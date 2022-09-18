import type Events from './dataSources/events';

export interface Context {
  dataSources: {
    event: Events
  }
}
