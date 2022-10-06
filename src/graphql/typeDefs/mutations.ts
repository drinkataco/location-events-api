import { gql } from 'apollo-server-core';

export default gql`
  #
  # Mutation Results
  #
  type MutationLocationResult {
    success: Boolean!
    result: Location
  }

  type MutationOrganisationResult {
    success: Boolean!
    result: Organisation
  }

  type MutationEventResult {
    success: Boolean!
    result: Event
  }

  type UpdateResult {
    success: Boolean!
    _id: ID!
  }

  type DeleteResult {
    success: Boolean!
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
  
  input OrganisationInputUpdate {
    name: String
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

  input EventInputUpdate {
    name: String
    description: String
    time: ScheduleInput
    location: ID
    organisation: ID
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
    updateLocation(
        id: ID!
        location: LocationInput!
      ): UpdateResult
    updateOrganisation(
        id: ID!, 
        organisation: OrganisationInputUpdate!
      ): UpdateResult
    updateEvent( 
        id: ID! 
        event: EventInputUpdate!
      ): UpdateResult
    # Removers
    deleteLocation(id: ID!): DeleteResult
    deleteOrganisation(id: ID!, deleteEvents: Boolean): DeleteResult
    deleteEvent(id: ID!): DeleteResult
  }
`;
