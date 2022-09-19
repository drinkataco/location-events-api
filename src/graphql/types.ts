import { gql } from 'apollo-server-core';

export default gql`
  scalar Date

  type Schedule {
    start: Date
    end: Date
  }

  type Address {
    line1: String!
    line2: String
    city: String!
    region: String
    postCode: String!
    country: String!
  }

  type Location {
    _id: ID!
    address: Address
    latitude: Int
    longitude: Int
    events: [Event]
  }

  type Event {
    _id: ID!
    location_id: ID
    title: String!
    time: Schedule
    location: Location!
    organisation: Organisation!
  }

  type Organisation {
    _id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!
    location: Location
    events: [Event]
  }

  type Query {
    events: [Event]
    organisations: [Organisation]
    locations: [Location]
  }
`;
