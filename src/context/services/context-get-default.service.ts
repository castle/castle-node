import { IncomingHttpHeaders } from 'http';

import { Configuration } from '../../configuraton';
import { ClientIdExtractService } from '../../client-id/client-id.module';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';

const optionalDefaults = (headers: IncomingHttpHeaders) => {
  const opts: { locale?: string; user_agent?: string } = {};

  if (!headers) {
    return opts;
  }

  if (headers['accept-language']) {
    opts.locale = headers['accept-language'];
  }

  if (headers['user-agent']) {
    opts.user_agent = headers['user-agent'];
  }
  return opts;
};

export const ContextGetDefaultService = {
  call: (request: any, configuration: Configuration) => {
    return {
      client_id:
        ClientIdExtractService.call(request.headers, request.cookies) || false,
      active: true,
      headers: HeadersExtractService.call(request.headers, configuration),
      ip: IPsExtractService.call(request.headers, configuration),
      library: {
        name: 'castle-node',
        version,
      },
      ...optionalDefaults(request.headers),
    };
  },
};
