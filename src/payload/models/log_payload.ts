import { IncomingHttpHeaders } from 'http2';

export interface LogPayload {
  request_token?: string;
  event: string;
  status?: string;
  user?: {
    id?: string;
    email?: string;
    registered_at?: string;
    traits?: object;
    name?: string;
  };
  created_at?: string;
  properties?: object;
  context?: {
    ip?: string;
    headers?: IncomingHttpHeaders;
  };
}
