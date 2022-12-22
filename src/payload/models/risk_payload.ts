import type { IncomingHttpHeaders } from 'http2';

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
  properties?: object;
  context: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
  created_at?: string;
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
