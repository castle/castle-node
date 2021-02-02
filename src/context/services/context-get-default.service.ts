import { IncomingHttpHeaders } from 'http';

import { Configuration } from '../../configuraton';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';

const optionalDefaults = (headers: IncomingHttpHeaders) => {
  let opts = {};

  if (!headers) {
    return opts;
  }

  if (headers['accept-language']) {
    opts['locale'] = headers['accept-language'];
  }

  if (headers['user-agent']) {
    opts['user_agent'] = headers['user-agent'];
  }
  return opts;
};

export const ContextGetDefaultService = {
  call: (context: any, configuration: Configuration) => {
    return {
      client_id: context.client_id || false,
      active: true,
      headers: HeadersExtractService.call(context.headers, configuration),
      ip: IPsExtractService.call(context.headers, configuration),
      library: {
        name: 'castle-node',
        version,
      },
      ...optionalDefaults(context.headers),
    };
  },
};
