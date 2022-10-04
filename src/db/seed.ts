/* eslint-disable import/no-extraneous-dependencies */
/*
 * This asynchronous script is a helper for seeding the database with documents
 *
 * Use the command `npm run db:seed` to run.
 *
 * By default 200 Events will be created, but you can change this number by passing through an
 *   argument (like `npm run db:seed -- 50`).
 * Alongside, Locations and Organisations are created - or sometimes reused as relations.
 */
import { faker } from '@faker-js/faker';

import * as db from './connect';
import loggerInstance from '../logger';
import {
  Event as EventModel,
  Location as LocationModel,
  Organisation as OrganisationModel,
} from './models';
import { Location, Organisation } from '../generated/graphql';

/* Amount of BASE documents to create. Our BASE document object is the EVENT object */
const DOCUMENTS = Number(process.argv[2] || 200);

/* create a logger instance for our logging pleasure */
const logger = loggerInstance();

/*
 * Arrays for orgs and locations.
 * This is so that some objects can be reused, so that we can better reflect a database
 */
const organisations: Array<Organisation> = [];
const locations: Array<Location> = [];

/*
 * All promises for creating all documents are processed asynchronously.
 * This array allows us to properly await for resolution at the end to correctly report
 */
const promises: Promise<unknown>[] = [];

/**
 * Create a random integer between the min and max values
 *
 * @param min - minimum bound
 * @param max - maximum bound
 *
 * @returns the random integer
 */
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

/**
 * Create a random title, between one and four nouns
 *
 * @returns the random integer
 */
const randomTitle = (): string =>
  Array.from(Array(randomInt(1, 4)))
    .map(() => faker.word.noun())
    .join(' ');

/**
 * Generic based function that allows us to determine whether to reuse or create a new document
 *  of given type
 *
 * @param list - a list of said documents, to not only use but push on to
 * @param func - a creation function of type. If we have determined not to reuse an object
 *  then we'll create one with this function
 * @param probability - the probability of reuse. Default 0.5 (50%)
 *
 * @returns a document
 */
const getDocument = <T>(
  list: Array<T>,
  func: () => T,
  probability = 0.7,
): T => {
  const create = !list.length || Math.random() <= probability;

  if (create) {
    const n = func();
    list.push(n);
    return n;
  }

  return list[Math.floor(Math.random() * list.length)] as T;
};

/**
 * Create a Location documents in Mongo
 *
 * @returns The Location Object
 */
const createLocation = () => {
  const city = faker.address.city();
  const location = new LocationModel({
    address: {
      line1: faker.address.streetAddress(),
      city,
      region: faker.address.state(),
      postCode: faker.address.zipCode(),
      country: faker.address.countryCode(),
    },
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  });

  logger.debug(`Creating Location '${city}'`);

  promises.push(location.save());

  return location;
};

/**
 * Create Organisation documents in Mongo
 *
 * @returns The Organisation Object
 */
const createOrganisation = () => {
  const location = getDocument<Location>(locations, createLocation);
  const name = randomTitle();
  const organisation = new OrganisationModel({
    name,
    location,
  });

  logger.debug(`Creating Organisation '${name}'`);

  promises.push(organisation.save());

  return organisation;
};

/**
 * Create an Event Document
 *
 * @param organisation - the org the event belongs to
 * @param location - the location the event is
 *
 * @returns the created event
 */
const createEvent = (location: Location, organisation: Organisation) => {
  const name = randomTitle();
  const dates = faker.date.betweens(
    '2020-01-01T00:00:00.000Z',
    '2020-12-01T00:00:00.000Z',
    2,
  );
  const start =
    (dates[0] as Date) < (dates[1] as Date) ? dates.pop() : dates.shift();
  const end = randomInt(0, 2) % 2 ? dates.pop() : undefined;

  const event = new EventModel({
    name,
    description: faker.lorem.paragraphs(1),
    time: {
      start,
      end,
    },
    location,
    organisation,
  });

  logger.debug(`Creating Event '${name}'`);

  promises.push(event.save());

  return event;
};

/*
 * Create documents for use. Each will also create a promise to be resolved.
 */
const createDocuments = (amount: number): Promise<unknown>[] => {
  Array.from(Array(amount)).forEach(() => {
    const org = getDocument<Organisation>(organisations, createOrganisation);
    const loc = getDocument<Location>(locations, createLocation, 0.2);

    createEvent(loc, org);
  });

  return promises;
};

// If this script is called directly, we'll automatically run seeding
if (require.main === module) {
  // Speedy - connect to the db, and create ALL documents in unison
  Promise.all([db.connect(logger), ...createDocuments(DOCUMENTS)])
    .then(async () => {
      logger.info(`${organisations.length} Organisations Created`);
      logger.info(`${DOCUMENTS} Events Created`);
      logger.info(`${locations.length} Locations Created`);
      logger.info('Database Seed Completed!');
      await db.disconnect(logger);
    })
    .catch((e) => {
      logger.error(e, 'Something funky happened');
      process.exit(1);
    })
    .finally(() => {
      process.exit();
    });
}

export default createDocuments;
