//
// Harcoded data for testing
//

export const locations = [
  {
    id: '1',
    addressLine1: 'The Hare & Hounds',
    addressLine2: 'High Street, Kings Heath',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B14 7JZ',
    country: 'GB',
  },
  {
    id: '2',
    addressLine1: 'The Mill',
    addressLine2: '29 Lower Trinity St, Deritent',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B9 4AG',
    country: 'GB',
  },
  {
    id: '3',
    addressLine1: 'The Crossing',
    addressLine2: '1 Milk Street, Deritent',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B5 5SU',
    country: 'GB',
  },
];

export const events = [
  {
    id: '1',
    organisationId: '1',
    locationId: '3',
    title: 'Total Luck',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
  {
    id: '2',
    organisationId: '1',
    locationId: '2',
    title: 'Mac Demarco',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
  {
    id: '3',
    organisationId: '1',
    locationId: '1',
    title: 'IDLES',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
];

export const organisations = [
  {
    id: '1',
    title: 'The Company',
    events,
  },
];
