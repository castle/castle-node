export type SearchEventsPayload = {
  filters: Array<
    | SearchEventsQueryFilter
    | SearchEventsRelativeRangeQueryFilter
    | SearchEventsRangeQueryFilter
    | SearchEventsExistsQueryFilter
    | SearchEventsOrQueryFilter
  >;
  query_type?: SearchEventsQueryType;
  page?: number;
  columns?: Array<string>;
  results_size?: number;
};

export enum SearchEventsQueryType {
  COUNT = '$count',
  RECORDS = '$records',
  RECORDS_WITH_COUNT = '$records_with_count',
}

export type SearchEventsQueryFilter = {
  field: string;
  op: SearchEventsQueryFilterOperator;
  value:
    | string
    | number
    | boolean
    | Array<string>
    | Array<number>
    | { reference: string };
};

export enum SearchEventsQueryFilterOperator {
  IN = '$in',
  NIN = '$nin',
  EQ = '$eq',
  NEQ = '$neq',
  LIKE = '$like',
  NLIKE = '$nlike',
  CONTAINS = '$contains',
  NCONTAINS = '$ncontains',
  STARTS_WITH = '$starts_with',
  NSTARTS_WITH = '$nstarts_with',
  ENDS_WITH = '$ends_with',
  NENDS_WITH = '$nends_with',
  MATCHES = '$matches',
  NMATCHES = '$nmatches',
  IP_RANGE = '$ip_range',
  NIP_RANGE = '$nip_range',
}

export type SearchEventsRelativeRangeQueryFilter = {
  field: string;
  op: '$relative_range';
  value: {
    gteq?: number;
    gt?: number;
    lteq?: number;
    lt?: number;
  };
};

export type SearchEventsRangeQueryFilter = {
  field: string;
  op: '$range';
  value: {
    gteq?: string | number;
    gt?: string | number;
    lteq?: string | number;
    lt?: string | number;
  };
};

export type SearchEventsExistsQueryFilter = {
  field: string;
  op: '$exists' | '$nexists';
};

export type SearchEventsOrQueryFilter = {
  value: Array<
    | SearchEventsQueryFilter
    | SearchEventsRelativeRangeQueryFilter
    | SearchEventsRangeQueryFilter
    | SearchEventsExistsQueryFilter
  >;
  op: '$or';
};
