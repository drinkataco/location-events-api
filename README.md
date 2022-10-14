# location-events-api

![Application](https://github.com/drinkataco/location-events-api/actions/workflows/application.yaml/badge.svg)
![Infrastructure](https://github.com/drinkataco/location-events-api/actions/workflows/infrastructure.yaml/badge.svg)

GraphQL based API that has the abilities to Create, Read, Update, & Delete Locations & Events. Query and find all the locations & events belonging to an organisation, as well as the reverse: being able to query a location(s) / event(s) and having the ability to find the organisation it belongs to.

The application uses [Apollo](https://www.apollographql.com/) and [Fastify](https://www.fastify.io/) as its main graphql and web server. Alongside is [MongoDB](https://www.mongodb.com/) to store data, and a [Redis](https://redis.io/) cache to speed up and cache responses.

## Development

To run locally

1. Install node modules `npm i`
1. Set up `.env` file - you can just copy the `.env.example` file for now
1. Run `docker compose up` to start a mongodb container and redis container
1. Run `npm run db:seed` to seed the database with documents
1. Start the application with `npm run dev` and visit [localhost:3000/graphql](http://localhost:3000/graphql) to query the application

Alternatively, the command `npm run build` builds a production distribution.

## Kubernetes

This project includes a kubernetes deployment in the `k8s/` directory.

A helper script is supplied, `./k8s/deploy.sh [-f .env]`. This allows resources to be deployed smoothly by;

- Installing resource dependencies via [helm](https://helm.sh/docs/intro/install/) (traefik and cert-manager)
- Ensures secrets are defined (for container registry authentication and .env definitions)

### Secrets

#### Container Repository Authentication

To fetch the container from the repository kubernetes must be authenticated with the github container registry with their username and [github token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry).

Run the following command with your credentials:

```bash
kubectl create secret docker-registry ghcr-drinkataco \
  --docker-server=ghcr.io \
  --docker-username="$GITHUB_USERNAME" \
  --docker-password="$GHCR_TOKEN"
```

#### ENV File

The container requires several environment variables to be set (as described in the [example file](./.env.example)).

This file is sourced from a secret in the kubernetes deployment.

```bash
kubectl create secret generic ghcr-drinkataco \
  --from-env-file=.env
```

## CI/CD

On push and tag, typescript linting (using eslint) and testing (using jest) are performed before building.

### Deployment

The application is deployed by tagging based on [semantic versioning](https://semver.org/).

This tag triggers a release workflow and the latest packaged is released to the [repository](https://github.com/drinkataco?tab=packages&repo_name=location-events-api).

## Examples

### Queries

The API contains similar methods of access for each collection and each document. A collection can be queried with a find Query (such as `findEvents`) and can be passed parameters related to pagination and ordering. The response includes the `results` and `meta` (which includes total documents, for example).

```graphql
query FindEvents {
  findEvents(limit: 10, order: { by: time, dir: desc }) {
    meta {
      total
      limit
      offset
    }
    results {
      _id
      name
      time {
        start
        end
      }
    }
  }
}
```

Similar methods for querying organisations (findOrganisations) and locations (findLocations) allso exist.

Documents are queried just by stating the document type as a field - such as `event` or `organisation`. They take an `id` argument.

```graphql
query Event {
  event(id: "6343ea4a241c18e3ec46a39d") {
    _id
    name
    description
    time {
      start
      end
    }
  }
}
```

Furthermore, on all collection and document queries we can subquery relations. For example, on an event we could query the location (which is a one to one) by adding the organisation field. If the relationship is one to many, such as organisation to its events, we can use the findEvents query, with the same parameters listed above (such as pagination and ordering).

### Mutations

Mutations are formatted similarly to the collection queries, but prefaced with create, update, and delete.

Create Mutation takes parameters relating to the required fields of that object. A location, however, only requires an address, or a latlng. The missing information will be gathered and filled out from Google Maps API.

```graphql
mutation newLocation {
  createLocation(location: {
    address: {
      line1: "Alligator Lounge",
      line2: "600 Metropolitan Ave",
      city: "Brooklyn",
      region: "New York",
      postCode: "NY 112211",
      country: "USA"
    }
  }) {
    success
    result {
      _id
      latitude
      longitude
    }
  }
}
```

The repsonse above will return the correct latitude and longitude of the supplied address.

An update is similar, but must include an `id` parameter. A delete only requires an `id`.
