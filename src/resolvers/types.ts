import { gql } from 'apollo-server-core';

export default gql`
  scalar Date

  type Schedule {
    start: Date
    end: Date
  }

  type Location {
    addressLine1: String!
    addressLine2: String
    city: String!
    region: String
    postCode: String!
    country: String!
    events: [Event]
  }

  type Event {
    id: ID!
    organisationId: ID
    organisation: Organisation
    title: String!
    time: Schedule
    location: Location
  }

  type Organisation {
    id: ID!
    title: String!
    events: [Event]
  }

  type Query {
    events: [Event]
    organisations: [Organisation]
    locations: [Location]
  }
`;
