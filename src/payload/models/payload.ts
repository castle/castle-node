import type { IncomingHttpHeaders } from 'http2';

// legacy Payload
export interface Payload {
  event?: string;
  user_id?: string;
  user_traits?: object;
  properties?: object;
  created_at?: string;
  device_token?: string;
  context?: {
    ip: string;
    headers: IncomingHttpHeaders | { [key: string]: string | boolean };
  };
}
