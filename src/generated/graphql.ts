import MyContext from '../graphql/context';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String'];
  country: Scalars['String'];
  line1: Scalars['String'];
  line2?: Maybe<Scalars['String']>;
  postCode: Scalars['String'];
  region?: Maybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  _id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  location: Location;
  name: Scalars['String'];
  organisation: Organisation;
  time?: Maybe<Schedule>;
};

export type EventQueryResult = {
  __typename?: 'EventQueryResult';
  meta?: Maybe<Meta>;
  results: Array<Maybe<Event>>;
};

export type Location = {
  __typename?: 'Location';
  _id: Scalars['ID'];
  address?: Maybe<Address>;
  findEvents?: Maybe<EventQueryResult>;
  findOrganisations?: Maybe<EventQueryResult>;
  latitude?: Maybe<Scalars['Int']>;
  longitude?: Maybe<Scalars['Int']>;
};


export type LocationFindEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type LocationFindOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type LocationQueryResult = {
  __typename?: 'LocationQueryResult';
  meta?: Maybe<Meta>;
  results: Array<Maybe<Location>>;
};

export type Meta = {
  __typename?: 'Meta';
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type Organisation = {
  __typename?: 'Organisation';
  _id: Scalars['ID'];
  createdAt: Scalars['Date'];
  findEvents?: Maybe<EventQueryResult>;
  location?: Maybe<Location>;
  name: Scalars['String'];
  updatedAt: Scalars['Date'];
};


export type OrganisationFindEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type OrganisationQueryResult = {
  __typename?: 'OrganisationQueryResult';
  meta?: Maybe<Meta>;
  results: Array<Maybe<Organisation>>;
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  findEvents?: Maybe<EventQueryResult>;
  findLocations?: Maybe<LocationQueryResult>;
  findOrganisations?: Maybe<OrganisationQueryResult>;
  location?: Maybe<Location>;
  organisation?: Maybe<Organisation>;
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryFindEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryLocationArgs = {
  id: Scalars['ID'];
};


export type QueryOrganisationArgs = {
  id: Scalars['ID'];
};

export type Schedule = {
  __typename?: 'Schedule';
  end?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Event: ResolverTypeWrapper<Event>;
  EventQueryResult: ResolverTypeWrapper<EventQueryResult>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Location: ResolverTypeWrapper<Location>;
  LocationQueryResult: ResolverTypeWrapper<LocationQueryResult>;
  Meta: ResolverTypeWrapper<Meta>;
  Organisation: ResolverTypeWrapper<Organisation>;
  OrganisationQueryResult: ResolverTypeWrapper<OrganisationQueryResult>;
  Query: ResolverTypeWrapper<{}>;
  Schedule: ResolverTypeWrapper<Schedule>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  Event: Event;
  EventQueryResult: EventQueryResult;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Location: Location;
  LocationQueryResult: LocationQueryResult;
  Meta: Meta;
  Organisation: Organisation;
  OrganisationQueryResult: OrganisationQueryResult;
  Query: {};
  Schedule: Schedule;
  String: Scalars['String'];
};

export type AddressResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  line1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EventResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organisation?: Resolver<ResolversTypes['Organisation'], ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes['Schedule']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventQueryResultResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['EventQueryResult'] = ResolversParentTypes['EventQueryResult']> = {
  meta?: Resolver<Maybe<ResolversTypes['Meta']>, ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  findEvents?: Resolver<Maybe<ResolversTypes['EventQueryResult']>, ParentType, ContextType, RequireFields<LocationFindEventsArgs, 'limit' | 'offset'>>;
  findOrganisations?: Resolver<Maybe<ResolversTypes['EventQueryResult']>, ParentType, ContextType, RequireFields<LocationFindOrganisationsArgs, 'limit' | 'offset'>>;
  latitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationQueryResultResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['LocationQueryResult'] = ResolversParentTypes['LocationQueryResult']> = {
  meta?: Resolver<Maybe<ResolversTypes['Meta']>, ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Location']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetaResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  offset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganisationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Organisation'] = ResolversParentTypes['Organisation']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  findEvents?: Resolver<Maybe<ResolversTypes['EventQueryResult']>, ParentType, ContextType, RequireFields<OrganisationFindEventsArgs, 'limit' | 'offset'>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganisationQueryResultResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['OrganisationQueryResult'] = ResolversParentTypes['OrganisationQueryResult']> = {
  meta?: Resolver<Maybe<ResolversTypes['Meta']>, ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Organisation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  event?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventArgs, 'id'>>;
  findEvents?: Resolver<Maybe<ResolversTypes['EventQueryResult']>, ParentType, ContextType, RequireFields<QueryFindEventsArgs, 'limit' | 'offset'>>;
  findLocations?: Resolver<Maybe<ResolversTypes['LocationQueryResult']>, ParentType, ContextType, RequireFields<QueryFindLocationsArgs, 'limit' | 'offset'>>;
  findOrganisations?: Resolver<Maybe<ResolversTypes['OrganisationQueryResult']>, ParentType, ContextType, RequireFields<QueryFindOrganisationsArgs, 'limit' | 'offset'>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  organisation?: Resolver<Maybe<ResolversTypes['Organisation']>, ParentType, ContextType, RequireFields<QueryOrganisationArgs, 'id'>>;
};

export type ScheduleResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = {
  end?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MyContext> = {
  Address?: AddressResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  EventQueryResult?: EventQueryResultResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  LocationQueryResult?: LocationQueryResultResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  Organisation?: OrganisationResolvers<ContextType>;
  OrganisationQueryResult?: OrganisationQueryResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
};

