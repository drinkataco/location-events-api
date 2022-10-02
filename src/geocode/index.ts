import { Client, AddressComponent } from '@googlemaps/google-maps-services-js';

import { GOOGLE_MAPS_API_KEY } from '../consts';
import { Address } from '../generated/graphql';

const googleMapsClient = new Client();

const checkKey = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw Error('No Google Maps API key provided for location lookup');
  }
};

/**
 * Find an address from latitude and longitude coordinates
 *
 * @param lat - latitude coordinates
 * @param lng - longitude coordinates
 *
 * @returns a constructed address object
 */
export const findAddressFromLatLng = async (
  lat: number,
  lng: number,
): Promise<Address> => {
  checkKey();

  const response = await googleMapsClient.geocode({
    params: {
      address: `${lat},${lng}`,
      key: GOOGLE_MAPS_API_KEY as string,
    },
  });

  const result = response.data.results?.[0];

  if (!result) {
    throw Error('No Address found from Lat/Lng coords');
  }

  // We will now generate an Address object based on the lat/lng coords
  const getParts = (
    extract: string[],
  ): string | undefined => {
    const line = result.address_components
      .filter((component: AddressComponent) =>
        component.types.some((r) => extract.includes(r)))
      .map((k: AddressComponent) => k.long_name);

    return line.join(', ');
  };

  return {
    line1: getParts(['street_number', 'route']) as string,
    city: getParts(['postal_town']) || getParts(['sublocality_level_1']) as string,
    region: getParts(['administrative_area_level_1']),
    postCode: getParts(['postal_code']) as string,
    country: getParts(['country']) as string,
  };
};

/**
 * Find latlng coordinates from an address
 *
 * @param address - supplied address
 *
 * @returns tuple with latlng values
 */
export const findLatLngFromAddress = async (address: Address): Promise<[number, number]> => {
  checkKey();

  const formattedAddress = Object.values(address).join(', ');

  const response = await googleMapsClient.geocode({
    params: {
      address: formattedAddress,
      key: GOOGLE_MAPS_API_KEY as string,
    },
  });

  const result = response.data.results?.[0];

  if (!result) {
    throw Error('No Lat/Lng coords found from address');
  }

  return [result.geometry.location.lat, result.geometry.location.lng];
};
