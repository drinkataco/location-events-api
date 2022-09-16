# location-events-api

![Application CICD](https://github.com/drinkataco/location-events-api/actions/workflows/application.yaml/badge.svg)

GraphQL based API that has the abilities to Create, Read, Update, & Delete Locations & Events. Query and find all the locations & events belonging to an organisation, as well as the reverse: being able to query a location(s) / event(s) and having the ability to find the organisation it belongs to.

## Application

`npm run build` - this (you guessed it) builds the typescript graphql application


### Development

`npm run dev` - run, and build on each file change. Although, before doing this you may want to run:

- `docker compose up` - run a mongo database on your machine to be used for development. This includes mongo express, a simple GUI to view your database at port 8081
- `npm run db:seed` - place testable data in the database. Default 200 events, change by passing a value such as `-- 500`.

### Env file

Before build or development you must create a `.env` file. You can copy the `.env.example` file for development purposes.

## CI/CD

On push and tag, typescript linting (using eslint) and testing (using jest) are performed before building.

The application is deployed by tagging based on [semantic versioning](https://semver.org/). Once tagged, a github package is created for the dockerfile.
