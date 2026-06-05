import { isEmpty, pickByTruthy } from '../../utils/object';
import { Configuration } from '../../configuration';
import { ClientIdExtractService } from '../../client-id/client-id.module';
import { HeadersExtractService } from '../../headers/headers.module';
import { IPsExtractService } from '../../ips/ips.module';
import { version } from '../../../package.json';
import type { CastleRequest } from './request';

// Framework-agnostic lookup for the connection's peer address. Covers the raw
// Node `IncomingMessage` (and Express/Fastify/Koa/Next, which build on it) via
// `socket`/`connection`, and Hapi via `info`.
const remoteAddressFrom = (request: CastleRequest): string | undefined =>
  request?.socket?.remoteAddress ??
  request?.connection?.remoteAddress ??
  request?.info?.remoteAddress ??
  undefined;

const requestContextData = (
  request: CastleRequest,
  cookies: string | undefined,
  configuration: Configuration
): { [key: string]: any } => {
  if (isEmpty(request)) {
    return {};
  }

  const cookiesForClientId =
    cookies || (request.headers as { [key: string]: any })?.cookies;
  return {
    client_id:
      ClientIdExtractService.call(request.headers, cookiesForClientId) || false,
    active: true,
    headers: HeadersExtractService.call(request.headers, configuration),
    ip: IPsExtractService.call(
      request.headers,
      configuration,
      remoteAddressFrom(request)
    ),
  };
};

export const ContextGetDefaultService = {
  call: (
    request: CastleRequest,
    cookies: string | undefined,
    configuration: Configuration
  ): { [key: string]: any } => {
    return {
      ...pickByTruthy(requestContextData(request, cookies, configuration)),
      library: {
        name: 'castle-node',
        version,
      },
    };
  },
};
