import type { IncomingHttpHeaders } from 'http2';

export interface RiskPayload {
  request_token: string;
  event: string;
  status: string;
  user: {
    id: string;
    email?: string;
    registered_at?: string;
    traits?: object;
    name?: string;
  };
  properties?: object;
  context: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
}
