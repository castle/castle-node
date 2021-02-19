import { IncomingHttpHeaders } from 'http2';

export type Payload = {
  event?: string;
  user_id: string;
  user_traits?: object;
  properties?: object;
  created_at?: string;
  device_token?: string;
  context?: {
    ip: string;
    headers: IncomingHttpHeaders;
  };
};
