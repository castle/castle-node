import pino from 'pino';

import {
  DEFAULT_ALLOWLIST,
  DEFAULT_API_URL,
  DEFAULT_TIMEOUT,
} from './constants';
import { Configuration as ConfiguratonAttributes } from './models';
import { FailoverStrategy } from './failover/models/failover-strategy';

export class Configuration {
  apiSecret: string;
  apiUrl?: string;
  timeout?: number;
  allowlisted?: string[];
  denylisted?: string[];
  overrideFetch?: any;
  failoverStrategy?: FailoverStrategy;
  logLevel?: pino.Level;
  doNotTrack?: boolean;
  ipHeaders?: string[];
  trustedProxies?: RegExp[];
  trustProxyChain?: boolean;
  trustedProxyDepth?: number;

  constructor({
    apiSecret,
    apiUrl,
    timeout = DEFAULT_TIMEOUT,
    allowlisted = [],
    denylisted = [],
    overrideFetch = fetch,
    failoverStrategy = FailoverStrategy.allow,
    logLevel = 'error',
    doNotTrack = false,
    ipHeaders = [],
    trustedProxies = [],
    trustProxyChain = false,
    trustedProxyDepth = 0,
  }: ConfiguratonAttributes) {
    if (!apiSecret) {
      throw new Error(
        'Castle: Unable to instantiate Castle client, API secret is missing.'
      );
    }

    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || DEFAULT_API_URL;
    this.timeout = timeout;
    this.allowlisted = allowlisted.length
      ? allowlisted.map((x) => x.toLowerCase())
      : DEFAULT_ALLOWLIST;
    this.denylisted = denylisted.map((x) => x.toLowerCase());
    this.overrideFetch = overrideFetch;
    this.failoverStrategy = failoverStrategy;
    this.logLevel = logLevel;
    this.doNotTrack = doNotTrack;
    this.ipHeaders = ipHeaders;
    this.trustedProxies = trustedProxies.map((proxy) => new RegExp(proxy));
    this.trustProxyChain = trustProxyChain;
    this.trustedProxyDepth = trustedProxyDepth;
  }
}
