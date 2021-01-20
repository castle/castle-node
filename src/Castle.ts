import fetch from 'node-fetch';
import { reduce } from 'lodash';
import AbortController from 'abort-controller';
import { IncomingHttpHeaders } from 'http2';
import packageJson from '../package.json';
import pino from 'pino';

import {
  AuthenticateResult,
  Configuration,
  FailoverStrategy,
  Payload,
} from './models';

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
  private allowedHeaders: string[];
  private disallowedHeaders: string[];
  private overrideFetch: any;
  private failoverStrategy: FailoverStrategy;
  private logger: pino.Logger;
  private doNotTrack: boolean;

  constructor({
    apiSecret,
    apiUrl,
    timeout = 750,
    allowedHeaders = [],
    disallowedHeaders = [],
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
    this.allowedHeaders = allowedHeaders.map((x) => x.toLowerCase());
    this.disallowedHeaders = disallowedHeaders
      .concat(['cookie'])
      .map((x) => x.toLowerCase());
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
      return this.generateFailoverBody(params, 'do not track');
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
        return this.handleFailover(params, 'timeout', err);
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
      return this.handleFailover(params, 'server error');
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

  private scrubHeaders(headers: IncomingHttpHeaders) {
    return reduce(
      headers,
      (accumulator: object, value: string, key: string) => {
        if (this.disallowedHeaders.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: true,
          };
        }
        if (
          this.allowedHeaders.length &&
          !this.allowedHeaders.includes(key.toLowerCase())
        ) {
          return {
            ...accumulator,
            [key]: true,
          };
        }

        return {
          ...accumulator,
          [key]: value,
        };
      },
      {}
    );
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
        headers: this.scrubHeaders(context.headers),
        library: {
          name: 'castle-node',
          version: packageJson.version,
        },
      },
    });
  }

  private generateFailoverBody(
    params: Payload,
    reason: string
  ): AuthenticateResult {
    return {
      action:
        // This is just for the type system, asurring it that failOverStrategy
        // can not be 'none'.
        this.failoverStrategy === 'none' ? 'allow' : this.failoverStrategy,
      failover: true,
      failover_reason: reason,
      user_id: params.user_id,
    };
  }

  private handleFailover(
    params: Payload,
    reason: string,
    err?: Error
  ): AuthenticateResult {
    // Have to check it this way to make sure TS understands
    // that this.failoverStrategy is of type Verdict,
    // not FailoverStrategyType.
    if (this.failoverStrategy !== 'none') {
      return this.generateFailoverBody(params, reason);
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
