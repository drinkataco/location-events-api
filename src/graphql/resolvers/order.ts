import * as Types from '../../generated/graphql';

/**
 * Default sorting function
 * Sort array by a field in the object
 *
 * @param dir - direction of sort
 * @param fieldName - name of field to sort
 *
 * @returns function to pass to Array.prototype.sort() to sort the collection
 */
const defaultSort =
  <T extends object>(
    dir: Types.QueryOrderDir.Desc | Types.QueryOrderDir.Asc,
    fieldName = 'createdAt',
  ) =>
    (a: T, b: T) => {
      const objField = fieldName as keyof T;
      if (a[objField] < b[objField]) {
        return dir === Types.QueryOrderDir.Desc ? 1 : -1;
      }
      if (a[objField] > b[objField]) {
        return dir === Types.QueryOrderDir.Desc ? -1 : 1;
      }
      return 0;
    };

/**
 * Sorting function for Event times
 * Sort using the event objects time.start field
 *
 * @param dir - direction of sort
 *
 * @returns function to pass to Array.prototype.sort() to sort the collection
 */
const eventTimeSort =
  <T extends object>(
    dir: Types.QueryOrderDir.Desc | Types.QueryOrderDir.Asc,
  ) =>
    (a: T, b: T) => {
      const eventA = a as Types.Event;
      const eventB = b as Types.Event;

      if (eventA.time.start < eventB.time.start) {
        return dir === Types.QueryOrderDir.Desc ? 1 : -1;
      }
      if (eventA.time.start > eventB.time.start) {
        return dir === Types.QueryOrderDir.Desc ? -1 : 1;
      }
      return 0;
    };

export default {
  time: eventTimeSort,
  default: defaultSort,
};
