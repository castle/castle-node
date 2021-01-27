import { IncomingHttpHeaders } from 'http';
import { Configuration } from '../../models';
import { TRUSTED_PROXIES } from '../../constants';

// ordered list of ip headers for ip extraction
const DEFAULT = ['X-Forwarded-For', 'Remote-Addr'];
// list of header which are used with proxy depth setting
const DEPTH_RELATED = ['X-Forwarded-For'];

const checkInternal = (ipAddress: string, proxies: Array<any>) => {
  return proxies.some((proxyRegexp) => proxyRegexp.test(ipAddress));
};

const limitProxyDepth = (ips, ipHeader, trustedProxyDepth) => {
  if (DEPTH_RELATED.includes(ipHeader)) {
    ips.pop(trustedProxyDepth);
  }
  return ips;
};

const IPsFrom = (ipHeader, headers, trustedProxyDepth) => {
  const headerValue = headers.get(ipHeader);

  if (!headerValue) {
    return [];
  }
  const ips = headerValue.strip().split(/[,\s]+/);
  limitProxyDepth(ips, ipHeader, trustedProxyDepth);
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
      ipHeaders,
      trustedProxies,
      trustProxyChain,
      trustedProxyDepth,
    }: Configuration
  ) => {
    const ipHeadersList = ipHeaders.length ? ipHeaders : DEFAULT;
    const proxiesList = trustedProxies.concat(TRUSTED_PROXIES);
    let allIPs = [];

    for (const ipHeader of ipHeadersList) {
      const IPs = IPsFrom(ipHeader, headers, trustedProxyDepth);
      const IPValue = removeProxies(IPs, trustProxyChain, proxiesList);

      if (IPValue) {
        return IPValue;
      }

      allIPs.push(IPs);
    }

    // fallback to first listed ip
    return allIPs[0];
  },
};
