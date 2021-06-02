import { IncomingHttpHeaders } from 'http2';

export type FilterPayload = {
  request_token: string;
  event: string;
  status?: string;
  user?: {
    id?: string;
    email?: string;
  };
  properties?: object;
  context: {
    ip: string;
    headers: IncomingHttpHeaders;
  };
};
