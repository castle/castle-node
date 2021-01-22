import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import packageJson from '../package.json';
import pino from 'pino';

import { DEFAULT_ALLOWLIST } from './constants';

import { AuthenticateResult, Configuration, Payload } from './models';

import {
  FailoverResponsePreparerService,
  FailoverStrategy,
} from './faliover/failover.module';
import { HeadersExtractorService } from './headers/headers.module';
import { LoggerService } from './logger/logger.module';

const defaultApiUrl = 'https://api.castle.io';

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
  private apiSecret: string;
  private apiUrl: string;
  private timeout: number;
  private allowlisted: string[];
  private denylisted: string[];
  private overrideFetch: any;
  private failoverStrategy: FailoverStrategy;
  private logger: pino.Logger;
  private doNotTrack: boolean;

  constructor({
    apiSecret,
    apiUrl,
    timeout = 750,
    allowlisted = [],
    denylisted = [],
    overrideFetch = fetch,
    failoverStrategy = 'allow',
    logLevel = 'error',
    doNotTrack = false,
  }: Configuration) {
    if (!apiSecret) {
      throw new Error(
        'Castle: Unable to instantiate Castle client, API secret is missing.'
      );
    }

    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
    this.timeout = timeout;
    this.allowlisted = allowlisted.length
      ? allowlisted.map((x) => x.toLowerCase())
      : DEFAULT_ALLOWLIST;
    this.denylisted = denylisted.map((x) => x.toLowerCase());
    this.overrideFetch = overrideFetch;
    this.failoverStrategy = failoverStrategy;
    this.logger = pino({
      prettyPrint: {
        levelFirst: true,
      },
    });
    this.logger.level = logLevel;
    this.doNotTrack = doNotTrack;
  }

  public async authenticate(params: Payload): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    if (this.doNotTrack) {
      return FailoverResponsePreparerService.call(
        params.user_id,
        'do not track',
        this.failoverStrategy
      );
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);
    const requestUrl = `${this.apiUrl}/v1/authenticate`;
    const requestOptions = {
      signal: controller.signal,
      method: 'POST',
      headers: this.generateDefaultRequestHeaders(),
      body: this.generateRequestBody(params),
    };

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

    if (this.doNotTrack) {
      return;
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);
    const requestUrl = `${this.apiUrl}/v1/track`;
    const requestOptions = {
      signal: controller.signal,
      method: 'POST',
      headers: this.generateDefaultRequestHeaders(),
      body: this.generateRequestBody(params),
    };

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
    return this.overrideFetch || fetch;
  }

  private generateDefaultRequestHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(`:${this.apiSecret}`).toString(
        'base64'
      )}`,
      'Content-Type': 'application/json',
    };
  }

  private generateRequestBody({
    event,
    user_id,
    user_traits,
    properties,
    context,
    created_at,
    device_token,
  }: Payload) {
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      properties,
      device_token,
      context: {
        ...context,
        client_id: context.client_id || false,
        headers: HeadersExtractorService.call(
          context.headers,
          this.allowlisted,
          this.denylisted
        ),
        library: {
          name: 'castle-node',
          version: packageJson.version,
        },
      },
    });
  }

  private handleFailover(
    user_id: string,
    reason: string,
    err?: Error
  ): AuthenticateResult {
    // Have to check it this way to make sure TS understands
    // that this.failoverStrategy is of type Verdict,
    // not FailoverStrategyType.
    if (this.failoverStrategy !== 'none') {
      return FailoverResponsePreparerService.call(
        user_id,
        reason,
        this.failoverStrategy
      );
    }

    if (this.failoverStrategy === 'none') {
      throw err;
    }
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
