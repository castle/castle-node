import isEmpty from 'lodash.isempty';

import { Configuration } from '../../configuraton';
import { ClientIdExtractService } from '../../client-id/client-id.module';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';

const requestContextData = (request: any, configuration: Configuration) => {
  if (isEmpty(request) || isEmpty(request.headers)) {
    return {};
  }
  return {
    client_id:
      ClientIdExtractService.call(request.headers, request.cookies) || false,
    active: true,
    headers: HeadersExtractService.call(request.headers, configuration),
    ip: IPsExtractService.call(request.headers, configuration),
  };
};

export const ContextGetDefaultService = {
  call: (request: any, configuration: Configuration) => {
    return {
      ...requestContextData(request, configuration),
      library: {
        name: 'castle-node',
        version,
      },
    };
  },
};
