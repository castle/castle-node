import { isEmpty, pickByTruthy } from '../../utils/object';
import { Configuration } from '../../configuration';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';
import type { IncomingHttpHeaders } from 'http2';

const requestContextData = (
  request: { headers: IncomingHttpHeaders },
  configuration: Configuration
): { [key: string]: any } => {
  if (isEmpty(request)) {
    return {};
  }

  return {
    headers: HeadersExtractService.call(request.headers, configuration),
    ip: IPsExtractService.call(request.headers, configuration),
  };
};

export const ContextGetDefaultService = {
  call: (
    request: { headers: IncomingHttpHeaders },
    configuration: Configuration
  ): { [key: string]: any } => {
    return {
      ...pickByTruthy(requestContextData(request, configuration)),
      library: {
        name: 'castle-node',
        version,
      },
    };
  },
};
