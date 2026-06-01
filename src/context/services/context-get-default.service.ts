import { Configuration } from '../../configuration';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';
import type { IncomingHttpHeaders } from 'http2';

export const ContextGetDefaultService = {
  call: (
    request: { headers: IncomingHttpHeaders },
    configuration: Configuration
  ): { [key: string]: any } => ({
    headers: HeadersExtractService.call(request.headers, configuration),
    ip: IPsExtractService.call(request.headers, configuration),
    library: {
      name: 'castle-node',
      version,
    },
  }),
};
