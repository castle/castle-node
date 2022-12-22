import type { IncomingHttpHeaders } from 'http2';

export type FilterPayload = {
  request_token: string;
  // deprecated
  user?: {
    id?: string;
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
  context: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
  product?: any;
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
} & ({ event: string } | { type: string; status?: string });
