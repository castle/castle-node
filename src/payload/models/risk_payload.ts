import type { IncomingHttpHeaders } from 'http2';
import type { AddressPayload } from './address_payload';

type BaseRiskPayload = {
  user: {
    id: string;
    phone?: string;
    email?: string;
    registered_at?: string;
    traits?: { [key: string]: any };
    name?: string;
    address?: { [key: string]: any };
  };
  properties?: { [key: string]: any };
  created_at?: string;
  product?: {
    id: string;
  };
  session?: {
    id: string;
    created_at?: string;
  };
  authentication_method?: {
    type: string;
    variant?: string;
    email?: string;
    phone?: string;
  };
  status?: string;
  name?: string;
  address?: AddressPayload;
  skip_request_token_validation?: boolean;
  skip_context_validation?: boolean;
} & ({ event: string } | { type: string });

type Context = {
  ip: string;
  headers: IncomingHttpHeaders | { [key: string]: string | boolean };
};

type RequiredContextAndToken = BaseRiskPayload & {
  request_token: string;
  context: Context;
  skip_request_token_validation?: false;
  skip_context_validation?: false;
};

type SkipRequestToken = BaseRiskPayload & {
  request_token?: string;
  context: Context;
  skip_request_token_validation: true;
  skip_context_validation?: false;
};

type SkipContext = BaseRiskPayload & {
  request_token: string;
  context?: Context;
  skip_request_token_validation?: false;
  skip_context_validation: true;
};

type SkipBoth = BaseRiskPayload & {
  request_token?: string;
  context?: Context;
  skip_request_token_validation: true;
  skip_context_validation: true;
};

export type RiskPayload =
  | RequiredContextAndToken
  | SkipRequestToken
  | SkipContext
  | SkipBoth;
