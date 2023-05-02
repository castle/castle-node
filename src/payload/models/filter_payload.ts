import type { IncomingHttpHeaders } from 'http2';

export type FilterPayload = {
  request_token: string;
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
  context: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
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
  skip_request_token_validation?: boolean;
  skip_context_validation?: boolean;
} & ({ event: string } | { type: string });
