import { gql } from 'apollo-server-core';

export default gql`
  scalar Date

  type Location {
    addressLine1: String!
    addressLine2: String
    city: String!
    region: String
    postCode: String!
    country: String!
  }

  type Event {
    title: String!
    time: Date
    location: Location
  }

  type Organisation {
    title: String!
    events: [Event]
  }

  type Query {
    events: [Event]
    organisations: [Organisation]
    locations: [Location]
  }
`;
