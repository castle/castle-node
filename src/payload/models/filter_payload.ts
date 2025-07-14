import type { IncomingHttpHeaders } from 'http2';

type BaseFilterPayload = {
  // deprecated
  user?: {
    email?: string;
    phone?: string;
  };
  matching_user_id?: string;
  params?: {
    email?: string;
    phone?: string;
    username?: string;
  };
  properties?: { [key: string]: any };
  product?: {
    id: string;
  };
  session?: {
    id: string;
    created_at?: string;
  };
  created_at?: string;
  authentication_method?: {
    type: string;
    variant?: string;
    email?: string;
    phone?: string;
  };
  status?: string;
  name?: string;
} & ({ event: string } | { type: string });

type Context = {
  ip: string;
  headers: IncomingHttpHeaders | { [key: string]: string | boolean };
};

type RequiredContextAndToken = BaseFilterPayload & {
  request_token: string;
  context: Context;
  skip_request_token_validation?: false;
  skip_context_validation?: false;
};

type SkipRequestToken = BaseFilterPayload & {
  request_token?: string;
  context: Context;
  skip_request_token_validation: true;
  skip_context_validation?: false;
};

type SkipContext = BaseFilterPayload & {
  request_token: string;
  context?: Context;
  skip_request_token_validation?: false;
  skip_context_validation: true;
};

type SkipBoth = BaseFilterPayload & {
  request_token?: string;
  context?: Context;
  skip_request_token_validation: true;
  skip_context_validation: true;
};

export type FilterPayload =
  | RequiredContextAndToken
  | SkipRequestToken
  | SkipContext
  | SkipBoth;
