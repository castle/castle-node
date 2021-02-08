import { IncomingHttpHeaders } from 'http';
import { HeadersGetCookieService } from '../../headers/headers.module';

export const ClientIdExtractService = {
  call: (headers: IncomingHttpHeaders = {}, cookies = '') => {
    return (
      headers['x-castle-client-id'] ||
      HeadersGetCookieService.call(cookies, '__cid') ||
      ''
    );
  },
};
