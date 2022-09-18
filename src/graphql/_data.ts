//
// Harcoded data for testing
//

export const locations = [
  {
    _id: '1',
    addressLine1: 'The Hare & Hounds',
    addressLine2: 'High Street, Kings Heath',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B14 7JZ',
    country: 'GB',
  },
  {
    _id: '2',
    addressLine1: 'The Mill',
    addressLine2: '29 Lower Trinity St, Deritent',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B9 4AG',
    country: 'GB',
  },
  {
    _id: '3',
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
    _id: '1',
    organisation_id: '1',
    location_id: '3',
    title: 'Total Luck',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
  {
    _id: '2',
    organisation_id: '1',
    location_id: '2',
    title: 'Mac Demarco',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
  {
    _id: '3',
    organisation_id: '1',
    location_id: '1',
    title: 'IDLES',
    time: {
      start: new Date(),
      end: new Date(),
    },
  },
];

export const organisations = [
  {
    _id: '1',
    title: 'The Company',
    events,
  },
];
