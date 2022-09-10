//
// Harcoded data for testing
//

export const locations = [
  {
    addressLine1: 'The Hare & Hounds',
    addressLine2: 'High Street, Kings Heath',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B14 7JZ',
    country: 'GB',
  },
  {
    addressLine1: 'The Mill',
    addressLine2: '29 Lower Trinity St, Deritent',
    city: 'Birmingham',
    region: 'West Midlands',
    postCode: 'B9 4AG',
    country: 'GB',
  },
  {
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
    title: 'Total Luck',
    time: new Date(),
    location: locations[0],
  },
  {
    title: 'Mac Demarco',
    time: new Date(),
    location: locations[1],
  },
  {
    title: 'IDLES',
    time: new Date(),
    location: locations[2],
  },
];

export const organisations = [
  {
    title: 'The Company',
    events,
  },
];
