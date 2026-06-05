import type { IncomingHttpHeaders } from 'http2';

// Minimal request shape the context services rely on. `headers` is always
// required; the optional fields expose the connection's peer address across
// frameworks (raw Node `IncomingMessage`, Express, Fastify, Koa, Next via
// `socket`/`connection`; Hapi via `info`) so the IP can be resolved even when
// no forwarding header is present.
export interface CastleRequest {
  headers: IncomingHttpHeaders;
  socket?: { remoteAddress?: string };
  connection?: { remoteAddress?: string };
  info?: { remoteAddress?: string };
}
