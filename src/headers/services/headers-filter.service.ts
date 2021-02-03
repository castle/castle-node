import { IncomingHttpHeaders } from 'http';
import { HeadersFormatService } from './headers-format.service';

const VALUABLE_HEADERS = /^HTTP(?:_|-).*|CONTENT(?:_|-)LENGTH|REMOTE(?:_|-)ADDR$/;
export const HeadersFilterService = {
  call: (headers: IncomingHttpHeaders) => {
    let filteredHeaders = {};
    Object.keys(headers).map((headerName) => {
      if (!VALUABLE_HEADERS.test(headerName)) {
        return;
      }
      const formattedName = HeadersFormatService.call(headerName);
      filteredHeaders[formattedName] = headers[headerName];
      return filteredHeaders;
    });
    return filteredHeaders;
  },
};
