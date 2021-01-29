import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import pino from 'pino';

import {
  DEFAULT_ALLOWLIST,
  DEFAULT_API_URL,
  DEFAULT_TIMEOUT,
} from './constants';
import { AuthenticateResult, Configuration, Payload } from './models';
import {
  CommandAuthenticateService,
  CommandTrackService,
} from './command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from './failover/failover.module';
import { LoggerService } from './logger/logger.module';
// import { Configuration } from './configuraton';

// The body on the request is a stream and can only be
// read once, by default. This is a workaround so that the
// logging functions can read the body independently
// of the handlers.
const getBody = async (response: any) => {
  if (response.cachedBody) {
    return response.cachedBody;
  }

  try {
    response.cachedBody = await response.json();
  } catch (e) {
    response.cachedBody = {};
  }

  return response.cachedBody;
};

const isTimeout = (e: Error) => e.name === 'AbortError';

export class Castle {
  private logger: pino.Logger;
  private configuration: Configuration;

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
  }: Configuration) {
    if (!apiSecret) {
      throw new Error(
        'Castle: Unable to instantiate Castle client, API secret is missing.'
      );
    }

    this.configuration = {
      apiSecret,
      apiUrl: apiUrl || DEFAULT_API_URL,
      timeout,
      allowlisted: allowlisted.length
        ? allowlisted.map((x) => x.toLowerCase())
        : DEFAULT_ALLOWLIST,
      denylisted: denylisted.map((x) => x.toLowerCase()),
      overrideFetch,
      failoverStrategy,
      logLevel,
      doNotTrack,
      ipHeaders,
      trustedProxies: trustedProxies.map((proxy) => new RegExp(proxy)),
      trustProxyChain,
      trustedProxyDepth,
    };
    this.logger = pino({
      prettyPrint: {
        levelFirst: true,
      },
    });
    this.logger.level = logLevel;
  }

  public async authenticate(params: Payload): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    if (this.configuration.doNotTrack) {
      return FailoverResponsePrepareService.call(
        params.user_id,
        'do not track',
        this.configuration.failoverStrategy
      );
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.configuration.timeout);
    const { requestUrl, requestOptions } = CommandAuthenticateService.call(
      controller,
      params,
      this.configuration
    );

    try {
      response = await this.getFetch()(requestUrl, requestOptions);
    } catch (err) {
      LoggerService.call({ requestUrl, requestOptions, err }, this.logger);

      if (isTimeout(err)) {
        return this.handleFailover(params.user_id, 'timeout', err);
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
    }

    // Wait to get body here to prevent race conditions
    // on `.json()` because we attempt to read it in
    // multiple places.
    const body = await getBody(response);

    LoggerService.call(
      { requestUrl, requestOptions, response, body },
      this.logger
    );

    if (response.status >= 500) {
      return this.handleFailover(params.user_id, 'server error');
    }

    this.handleUnauthorized(response);
    this.handleBadResponse(response);

    return body;
  }

  public async track(params: Payload): Promise<void> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
    }

    if (this.configuration.doNotTrack) {
      return;
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.configuration.timeout);
    const { requestUrl, requestOptions } = CommandTrackService.call(
      controller,
      params,
      this.configuration
    );

    try {
      response = await this.getFetch()(requestUrl, requestOptions);
    } catch (err) {
      if (isTimeout(err)) {
        return LoggerService.call(
          { requestUrl, requestOptions, err },
          this.logger
        );
      }
    } finally {
      clearTimeout(timeout);
    }

    LoggerService.call({ requestUrl, requestOptions, response }, this.logger);
    this.handleUnauthorized(response);
    this.handleBadResponse(response);
  }

  private getFetch() {
    return this.configuration.overrideFetch || fetch;
  }

  private handleFailover(
    userId: string,
    reason: string,
    err?: Error
  ): AuthenticateResult {
    // Have to check it this way to make sure TS understands
    // that this.failoverStrategy is of type Verdict,
    // not FailoverStrategyType.
    if (this.configuration.failoverStrategy === FailoverStrategy.throw) {
      throw err;
    }

    return FailoverResponsePrepareService.call(
      userId,
      reason,
      this.configuration.failoverStrategy
    );
  }

  private handleUnauthorized(response: Response) {
    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }
  }

  private handleBadResponse(response: Response) {
    if (response.status >= 400 && response.status < 500) {
      throw new Error(`Castle: API response not ok, got ${response.status}.`);
    }
  }
}
