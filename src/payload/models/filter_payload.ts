import { IncomingHttpHeaders } from 'http2';

export type FilterPayload = {
  request_token?: string;
  event?: string;
  user?: {
    id: string;
    email: string;
  };
  properties?: object;
  created_at?: string;
  context?: {
    ip: string;
    headers: IncomingHttpHeaders;
  };
};
