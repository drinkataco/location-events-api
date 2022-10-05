# location-events-api

![Application CICD](https://github.com/drinkataco/location-events-api/actions/workflows/application.yaml/badge.svg)

GraphQL based API that has the abilities to Create, Read, Update, & Delete Locations & Events. Query and find all the locations & events belonging to an organisation, as well as the reverse: being able to query a location(s) / event(s) and having the ability to find the organisation it belongs to.

## Development

To run locally

1. Install node modules `npm i`
1. Set up `.env file` - you can just copy the `.env.example` file for now
1. Run `docker compose up` to start a local mongodb server
1. Run `npm run db:seed` to seed the database with documents
1. Start the application with `npm run dev` and visit [localhost:3000](http://localhost:3000) to query the application

## Production

Set up your `.env` and then run `npm run build`

## CI/CD

On push and tag, typescript linting (using eslint) and testing (using jest) are performed before building.

The application is deployed by tagging based on [semantic versioning](https://semver.org/). Once tagged, a github package is created for the dockerfile.
