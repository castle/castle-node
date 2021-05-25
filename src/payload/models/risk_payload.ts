import { IncomingHttpHeaders } from 'http2';

export type RiskPayload = {
  request_token?: string;
  event?: string;
  status?: string;
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
