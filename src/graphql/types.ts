import { gql } from 'apollo-server-core';

export default gql`
  scalar Date

  type Schedule {
    start: Date
    end: Date
  }

  type Location {
    _id: ID!
    addressLine1: String!
    addressLine2: String
    city: String!
    region: String
    postCode: String!
    country: String!
    events: [Event]
  }

  type Event {
    _id: ID!
    organisation_id: ID!
    location_id: ID
    title: String!
    time: Schedule
    location: Location
    organisation: Organisation
  }

  type Organisation {
    _id: ID!
    title: String!
    events: [Event]
  }

  type Query {
    events: [Event]
    organisations: [Organisation]
    locations: [Location]
  }
`;
