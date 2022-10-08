import { gql } from 'apollo-server-core';

export default gql`
  #
  # Query Types
  #
  type Query {
    # Document Queries
    event(id: ID!): Event
    location(id: ID!): Location
    organisation(id: ID!): Organisation

    # Collection Queries
    findEvents(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrderEvent
    ): EventQueryResult
    findLocations(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrder
    ): LocationQueryResult
    findOrganisations(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrder
    ): OrganisationQueryResult
  }

  #
  # Query Results
  #
  type Meta {
    total: Int
    limit: Int
    offset: Int
  }

  type EventQueryResult {
    results: [Event]!
    meta: Meta
  }

  type LocationQueryResult {
    results: [Location]!
    meta: Meta
  }

  type OrganisationQueryResult {
    results: [Organisation]!
    meta: Meta
  }

  #
  # Document Field Objects
  #
  type Schedule {
    start: Date!
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

  #
  # Document Object
  #
  type Location {
    _id: ID!
    address: Address
    latitude: Float
    longitude: Float
    createdAt: Date!
    updatedAt: Date!

    # Relations
    findEvents(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrderEvent
    ): EventQueryResult
    findOrganisations(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrder
    ): EventQueryResult
  }

  type Event {
    _id: ID!
    name: String!
    description: String
    time: Schedule!
    createdAt: Date!
    updatedAt: Date!

    # Relations
    location: Location
    organisation: Organisation!
  }

  type Organisation {
    _id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!

    # Relations
    location: Location
    findEvents(
      limit: Int = 200,
      offset: Int = 0,
      order: QueryOrderEvent
    ): EventQueryResult
  }

  #
  # Collection Ordering
  #
  input QueryOrder {
    dir: QueryOrderDir
    by: QueryOrderFieldEvent
  }

  enum QueryOrderDir {
    desc
    asc
  }

  enum QueryOrderFieldDefault {
    createdAt
    updatedAt
  }

  enum QueryOrderFieldEvent {
    time
    createdAt
    updatedAt
  }

  input QueryOrderEvent {
    dir: QueryOrderDir
    by: QueryOrderFieldEvent
  }
`;
