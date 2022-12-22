import type { IncomingHttpHeaders } from 'http2';

export type LogPayload = {
  request_token?: string;
  // deprecated
  user?: {
    id?: string;
    phone?: string;
    email?: string;
    registered_at?: string;
    traits?: { [key: string]: any };
    name?: string;
    address?: { [key: string]: any };
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
} & ({ event: string } | { type: string; status?: string });
