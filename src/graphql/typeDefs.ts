import { gql } from 'apollo-server-core';

export default gql`
  scalar Date

  #
  # Document Fields
  #
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

  #
  # Document Object
  #
  type Location {
    _id: ID!
    address: Address
    latitude: Int
    longitude: Int
    findEvents(limit: Int = 200, offset: Int = 0): EventQueryResult
    findOrganisations(limit: Int = 200, offset: Int = 0): EventQueryResult
  }

  type Event {
    _id: ID!
    name: String!
    description: String
    time: Schedule
    location: Location
    organisation: Organisation!
  }

  type Organisation {
    _id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!
    location: Location
    findEvents(limit: Int = 200, offset: Int = 0): EventQueryResult
  }

  #
  # Query types
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

  type Query {
    event(id: ID!): Event
    location(id: ID!): Location
    organisation(id: ID!): Organisation
    findEvents(limit: Int = 200, offset: Int = 0): EventQueryResult
    findLocations(limit: Int = 200, offset: Int = 0): LocationQueryResult
    findOrganisations(limit: Int = 200, offset: Int = 0): OrganisationQueryResult
  }

  #
  # Mutations 👾
  #
  type MutationLocationResult {
    success: Boolean!
    data: Location
  }

  type MutationOrganisationResult {
    success: Boolean!
    data: Organisation
  }

  type MutationEventResult {
    success: Boolean!
    data: Event
  }

  type DeleteResult {
    success: Boolean!
    _id: ID!
  }

  type Mutation {
    createLocation: MutationLocationResult
    createOrganisation: MutationOrganisationResult
    createEvent: MutationEventResult
    updateLocation: MutationLocationResult
    updateOrganisation: MutationOrganisationResult
    updateEvent: MutationEventResult
    deleteLocation: DeleteResult
    deleteOrganisation: DeleteResult
    deleteEvent: DeleteResult
  }
`;
