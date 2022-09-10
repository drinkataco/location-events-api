import { GraphQLScalarType, Kind } from 'graphql';

/* eslint-disable import/prefer-default-export */
export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (value): number => (value as Date).getTime(),
  parseValue: (value): Date => new Date((value as string)),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});
