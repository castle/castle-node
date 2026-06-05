import type { IncomingHttpHeaders } from 'http2';
import { Configuration } from '../../configuration';
import { TRUSTED_PROXIES } from '../../constants';

// ordered list of ip headers for ip extraction
const DEFAULT = ['x-forwarded-for', 'remote-addr'];
// list of header which are used with proxy depth setting
const DEPTH_RELATED = ['x-forwarded-for'];

const checkInternal = (ipAddress: string, proxies: any[]) => {
  return proxies.some((proxyRegexp) => proxyRegexp.test(ipAddress));
};

const limitProxyDepth = (ips, ipHeader, trustedProxyDepth) => {
  if (DEPTH_RELATED.includes(ipHeader)) {
    ips.splice(ips.length - 1, trustedProxyDepth);
  }
  return ips;
};

const IPsFrom = (ipHeader, headers, trustedProxyDepth) => {
  if (!headers) {
    return [];
  }
  const headerValue = headers[ipHeader];

  if (!headerValue) {
    return [];
  }
  const ips = headerValue.trim().split(/[,\s]+/);
  return limitProxyDepth(ips, ipHeader, trustedProxyDepth);
};

const removeProxies = (ips, trustProxyChain, proxiesList) => {
  if (trustProxyChain) {
    return ips[0];
  }
  const filteredIps = ips.filter((ip) => !checkInternal(ip, proxiesList));
  return filteredIps[filteredIps.length - 1];
};

export const IPsExtractService = {
  call: (
    headers: IncomingHttpHeaders,
    {
      ipHeaders = [],
      trustedProxies = [],
      trustProxyChain = false,
      trustedProxyDepth = 0,
    }: Configuration,
    remoteAddress?: string
  ) => {
    const ipHeadersList = ipHeaders.length ? ipHeaders : DEFAULT;
    const proxiesList = trustedProxies.concat(TRUSTED_PROXIES);

    // Node keeps the connection's peer address on the socket rather than in a
    // header, unlike the WSGI/Rack `REMOTE_ADDR` the Python/Ruby SDKs read. When
    // the caller supplies it and no `remote-addr` header is present, surface it
    // as `remote-addr` so it takes part in extraction with the usual precedence
    // (after `x-forwarded-for`). An existing `remote-addr` header is preserved.
    const effectiveHeaders =
      remoteAddress && !headers?.['remote-addr']
        ? { ...headers, 'remote-addr': remoteAddress }
        : headers;

    let allIPs: any[] = [];
    for (const ipHeader of ipHeadersList) {
      const IPs = IPsFrom(ipHeader, effectiveHeaders, trustedProxyDepth);
      const IPValue = removeProxies(IPs, trustProxyChain, proxiesList);
      if (IPValue) {
        return IPValue;
      }
      allIPs = [...allIPs, ...IPs];
    }

    // fallback to first listed ip
    return allIPs[0];
  },
};
