import type { IncomingHttpHeaders } from 'http2';
import type { AddressPayload } from './address_payload';

export type RiskPayload = {
  request_token: string;
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
  context: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
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
