import * as gms from '@googlemaps/google-maps-services-js';

import * as Geocode from '.';
import * as GeocodeFixture from './__fixtures__/google_maps_geocode_response.json';

// Mock google maps API
jest.mock('@googlemaps/google-maps-services-js');

const envVal = jest.fn().mockReturnValue(process.env.GOOGLE_MAPS_API_KEY);
jest.mock('../consts', () => ({
  ...process.env,
  get GOOGLE_MAPS_API_KEY(): string {
    return envVal() as string;
  },
}));

const mockedGms = gms as jest.Mocked<typeof gms>;
const GeocodeMockResponse = GeocodeFixture as gms.GeocodeResponse;

describe('google maps service api', () => {
  it('find an address from latlong values', async () => {
    expect.assertions(1);

    jest
      .spyOn(mockedGms.Client.prototype, 'geocode')
      .mockReturnValueOnce(Promise.resolve(GeocodeMockResponse));

    const address = await Geocode.findAddressFromLatLng(1, 2);

    expect(address).toMatchInlineSnapshot(`
      {
        "city": "Arverne",
        "country": "United States",
        "line1": "6802, Bayfield Avenue",
        "postCode": "11692",
        "region": "New York",
      }
    `);
  });

  it('finds latlong values from an address', async () => {
    expect.assertions(1);

    jest
      .spyOn(mockedGms.Client.prototype, 'geocode')
      .mockReturnValueOnce(Promise.resolve(GeocodeMockResponse));

    const latlng = await Geocode.findLatLngFromAddress({
      city: 'Arverne',
      country: 'United States',
      line1: '6802, Bayfield Avenue',
      postCode: '11692',
      region: 'New York',
    });

    expect(latlng).toStrictEqual([40.7139803, -73.9489598] as [number, number]);
  });

  it('throws an error if no google api key set', async () => {
    envVal.mockReturnValueOnce(undefined);

    await expect(Geocode.findAddressFromLatLng(1, 2)).rejects.toThrow(
      'No Google Maps API key provided for location lookup',
    );
  });

  it('throws an error if no latlong values found from address', async () => {
    expect.assertions(1);

    jest
      .spyOn(mockedGms.Client.prototype, 'geocode')
      .mockReturnValue(
        Promise.resolve({
          data: { results: [] },
        } as unknown as gms.GeocodeResponse),
      );

    await expect(
      Geocode.findLatLngFromAddress({
        city: 'Arverne',
        country: 'United States',
        line1: '6802, Bayfield Avenue',
        postCode: '11692',
        region: 'New York',
      }),
    ).rejects.toThrow('No Lat/Lng coords found from address');
  });

  it('throws an error if no address found from latlong values', async () => {
    expect.assertions(1);

    jest
      .spyOn(mockedGms.Client.prototype, 'geocode')
      .mockReturnValue(
        Promise.resolve({
          data: { results: [] },
        } as unknown as gms.GeocodeResponse),
      );

    await expect(Geocode.findAddressFromLatLng(1, 2)).rejects.toThrow(
      'No Address found from Lat/Lng coords',
    );
  });
});
