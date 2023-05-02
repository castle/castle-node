import type { IncomingHttpHeaders } from 'http2';
import type { AddressPayload } from './address_payload';

export type LogPayload = {
  request_token?: string;
  user?: {
    id?: string;
    phone?: string;
    email?: string;
    registered_at?: string;
    traits?: { [key: string]: any };
    name?: string;
    address?: AddressPayload;
  };
  created_at?: string;
  properties?: { [key: string]: any };
  context?: {
    ip?: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
  product?: any;
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
} & ({ event: string } | { type: string });
