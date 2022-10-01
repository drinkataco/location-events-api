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
    latitude: Float
    longitude: Float
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
  # Mutation Results
  #
  type MutationLocationResult {
    success: Boolean!
    errors: [String]
    result: Location
  }

  type MutationOrganisationResult {
    success: Boolean!
    errors: [String]
    result: Organisation
  }

  type MutationEventResult {
    success: Boolean!
    errors: [String]
    result: Event
  }

  type DeleteResult {
    success: Boolean!
    errors: [String]
    _id: ID!
  }

  #
  # Mutation Inputs
  #
  input AddressInput {
    line1: String!
    line2: String
    city: String!
    region: String
    postCode: String!
    country: String!
  }

  input LocationInput {
    address: AddressInput
    longitude: Float
    latitude: Float
  }

  input OrganisationInput {
    name: String!
    location: ID
  }

  input ScheduleInput {
    start: Date!
    end: Date
  }

  input EventInput {
    name: String!
    description: String
    time: ScheduleInput
    location: ID
    organisation: ID!
  }

  #
  # Mutation Queries
  #
  type Mutation {
    # Creators
    createLocation(location: LocationInput!): MutationLocationResult
    createOrganisation(
        organisation: OrganisationInput!,
        location: LocationInput
      ): MutationOrganisationResult
    createEvent(
        event: EventInput!
        location: LocationInput
      ): MutationEventResult
    # Editors
    updateLocation: MutationLocationResult
    updateOrganisation: MutationOrganisationResult
    updateEvent: MutationEventResult
    # Removers
    deleteLocation: DeleteResult
    deleteOrganisation: DeleteResult
    deleteEvent: DeleteResult
  }
`;
