import isEmpty from 'lodash.isempty';
import get from 'lodash.get';
import pickBy from 'lodash.pickby';
import { Configuration } from '../../configuration';
import { ClientIdExtractService } from '../../client-id/client-id.module';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';
import type { Request as ExpressRequest } from 'express';

const requestContextData = (
  request: ExpressRequest,
  cookies: string | undefined,
  configuration: Configuration
): { [key: string]: any } => {
  if (isEmpty(request)) {
    return {};
  }

  const cookiesForClientId = cookies || get(request, 'headers.cookies');
  return {
    client_id:
      ClientIdExtractService.call(request.headers, cookiesForClientId) || false,
    active: true,
    headers: HeadersExtractService.call(request.headers, configuration),
    ip: IPsExtractService.call(request.headers, configuration),
  };
};

export const ContextGetDefaultService = {
  call: (
    request: ExpressRequest,
    cookies: string | undefined,
    configuration: Configuration
  ): { [key: string]: any } => {
    return {
      ...pickBy(requestContextData(request, cookies, configuration)),
      library: {
        name: 'castle-node',
        version,
      },
    };
  },
};
