import { mergeTypeDefs } from '@graphql-tools/merge';

import common from './common';
import query from './query';
import mutations from './mutations';

export default mergeTypeDefs([
  common,
  query,
  mutations
])
