# location-events-api

![Application CICD](https://github.com/drinkataco/location-events-api/actions/workflows/application.yaml/badge.svg)

GraphQL based API that has the abilities to Create, Read, Update, & Delete Locations & Events. Query and find all the locations & events belonging to an organisation, as well as the reverse: being able to query a location(s) / event(s) and having the ability to find the organisation it belongs to.

## Application

`npm run build` - this (you guessed it) builds the typescript graphql application

`npm run watch` - build on each file change. Useful for development.

## CI/CD

On push and tag, typescript linting (using eslint) and testing (using jest) are performed before building.

The application is deployed by tagging based on [semantic versioning](https://semver.org/). Once tagged, a github package is created for the dockerfile.
