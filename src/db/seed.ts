/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-floating-promises */
/*
 * This Script is a helper for seeding the database with Events, Organisations, and Locations
 *
 * Use the command `npm run db:seed` to run.
 *
 * By default 200 Events will be created, but you can change this number by passing through an
 *   argument (like `npm run db:seed -- 50`).
 * Alongside, Locations and Organisations are created - or sometimes reused as relations.
 */
import { faker } from '@faker-js/faker';

import dbConnect from './connect';
import {
  Event as EventModel,
  Location as LocationModel,
  Organisation as OrganisationModel,
} from './models';
import loggerInstance from '../logger';
import { Location, Event, Organisation } from '../generated/graphql';

// Initialise Logger
const logger = loggerInstance();

// Create Mongo DB Connection
dbConnect(logger).catch((err) => {
  logger.error(err, 'Error Connecting to Database');
  process.exit(1);
});

// Randomiser Number Function
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

// Random
const randomTitle = (): string =>
  Array.from(Array(randomInt(1, 4)))
    .map(() => faker.word.noun())
    .join(' ');

const EVENTS = Number(process.argv[2] || 200);
const locations: Array<Location> = [];
const organisations: Array<Organisation> = [];

logger.info(`Starting Database Seed - Creating ${EVENTS} events`);

/**
 * Create Organisation documents in Mongo
 *
 * @returns The Organisation Object
 */
const createOrganisation = (): Organisation => {
  const organisation = new OrganisationModel({
    title: randomTitle(),
  });

  organisation.save();
  organisations.push(organisation);

  return organisation;
};

/**
 * Create a Location documents in Mongo
 *
 * @returns The Location Object
 */
const createLocation = (): Location => {
  const location = new LocationModel({
    addressLine1: faker.address.streetAddress(),
    city: faker.address.city(),
    region: faker.address.state(),
    postCode: faker.address.zipCode(),
    country: faker.address.countryCode(),
  });

  location.save();
  locations.push(location);

  return location;
};

/**
 * Create an Event Document
 *
 * @param organisation - the org the event belongs to
 * @param location - the location the event is
 *
 * @returns the created event
 */
const createEvent = async (
  organisation?: Organisation,
  location?: Location,
): Promise<Event> => {
  const eventOrg = organisation || createOrganisation();
  const eventLoc = location || createLocation();

  const title = randomTitle();
  const dates = faker.date.betweens(
    '2020-01-01T00:00:00.000Z',
    '2020-12-01T00:00:00.000Z',
    2,
  );
  const start =
    (dates[0] as Date) < (dates[1] as Date) ? dates.pop() : dates.shift();
  const end = randomInt(0, 2) % 2 ? dates.pop() : undefined;

  const event = new EventModel({
    title,
    time: {
      start,
      end,
    },
    location: eventLoc,
    organisation: eventOrg,
  });

  await event.save();

  return event;
};

/**
 * Create all events, and 30% of the time reuse locations and organisations
 */
const events = Array.from(Array(EVENTS)).map(async () => {
  // We should reuse orgs and locations to attach to the Event sometimes
  const createOrg = Math.random() < 0.3;
  const createLoc = Math.random() < 0.3;
  let location!: Location;
  let organisation!: Organisation;

  if (!createOrg && !!organisations.length) {
    organisation = organisations[
      Math.floor(Math.random() * organisations.length)
    ] as Organisation;
  }

  if (!createLoc && !!locations.length) {
    location = locations[
      Math.floor(Math.random() * organisations.length)
    ] as Location;
  }

  await createEvent(organisation, location);
});

Promise.all(events)
  .then(() => {
    logger.info('Seeding Completed');
  })
  .catch((err) => {
    logger.error(err, 'Error seeding Database');
    process.exit(1);
  });
