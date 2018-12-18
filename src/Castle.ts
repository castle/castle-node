import fetch from 'node-fetch';
import { reduce } from 'lodash';
import { IncomingHttpHeaders } from 'http2';
import AbortController from 'abort-controller';
import packageJson from '../package.json';
import pino from 'pino';

const defaultApiUrl = 'https://api.castle.io';

type ActionParameters = {
  event: string;
  user_id: string;
  user_traits?: object;
  properties?: object;
  created_at?: string;
  device_token?: string;
  context: {
    ip: string;
    client_id: string;
    headers: IncomingHttpHeaders;
  };
};

type actionTypes = 'allow' | 'deny' | 'challenge';

type failoverStrategyTypes = actionTypes | 'none';

type AuthenticateResult = {
  action: actionTypes;
  user_id?: string;
  device_token?: string;
  failover?: boolean;
  failover_reason?: string;
};

type LoggingParameters = {
  requestUrl: string;
  requestOptions: any;
  response?: Response;
  err?: Error;
  body?: any;
};

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
    if (e.message === "Cannot read property 'cachedBody' of undefined") {
      response.cachedBody = {};
    }
  }

  return response.cachedBody;
};

const isTimeout = (e: Error) => e.name === 'AbortError';

const errorFormatter = (err: Error) => `
Error name: ${err.name}
Error message: ${err.message}
`;

const responseFormatter = (response: Response, body: any) => `
Response status: ${response.status}
Response body: ${body}
`;

const requestFormatter = ({
  requestUrl,
  requestOptions,
  response,
  err,
  body,
}: LoggingParameters) => `
-- Castle request
URL: ${requestUrl}
Request: ${JSON.stringify(requestOptions)}
-- Castle response
${err && errorFormatter(err)}
${(response || body) && responseFormatter(response, body)}
`;

export class Castle {
  private apiSecret: string;
  private apiUrl: string;
  private timeout: number;
  private allowedHeaders: string[];
  private disallowedHeaders: string[];
  private overrideFetch: any;
  private failoverStrategy: failoverStrategyTypes;
  private logger: pino.Logger;

  constructor({
    apiSecret,
    apiUrl,
    timeout = 500,
    allowedHeaders = [],
    disallowedHeaders = [],
    overrideFetch = fetch,
    failoverStrategy = 'allow',
    logLevel = 'error',
  }: {
    apiSecret: string;
    apiUrl?: string;
    timeout?: number;
    allowedHeaders?: string[];
    disallowedHeaders?: string[];
    overrideFetch?: any;
    failoverStrategy?: failoverStrategyTypes;
    logLevel?: pino.Level;
  }) {
    if (!apiSecret) {
      throw new Error(
        'Castle: Unable to instantiate Castle client, API secret is missing.'
      );
    }

    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
    this.timeout = timeout;
    this.allowedHeaders = allowedHeaders.map(x => x.toLowerCase());
    this.disallowedHeaders = disallowedHeaders
      .concat(['cookie'])
      .map(x => x.toLowerCase());
    this.overrideFetch = overrideFetch;
    this.failoverStrategy = failoverStrategy;

    this.logger = pino({
      prettyPrint: {
        levelFirst: true,
      },
    });
    this.logger.level = logLevel;
  }

  public async authenticate(
    params: ActionParameters
  ): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
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
      this.handleLogging({ requestUrl, requestOptions, err });

      if (this.failoverStrategy === 'none') {
        throw err;
      }

      if (isTimeout(err)) {
        return {
          action: this.failoverStrategy,
          failover: true,
          failover_reason: 'timeout',
          user_id: params.user_id,
        };
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
    }

    this.handleUnauthorized(response);
    this.handleLogging({ requestUrl, requestOptions, response });

    return getBody(response);
  }

  public async track(params: ActionParameters): Promise<void> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
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
        return this.handleLogging({ requestUrl, requestOptions, err });
      }
    } finally {
      clearTimeout(timeout);
    }

    this.handleUnauthorized(response);
    this.handleLogging({ requestUrl, requestOptions, response });
  }

  private handleLogging({
    requestUrl,
    requestOptions,
    response,
    err,
  }: LoggingParameters) {
    if (err) {
      return this.logger.error(
        requestFormatter({ requestUrl, requestOptions, err })
      );
    }

    const body = getBody(response);

    let log: pino.LogFn;

    if (response.ok) {
      log = this.logger.info;
    } else if (response.status < 500 && response.status >= 400) {
      log = this.logger.error;
    } else {
      log = this.logger.warn;
    }

    return log(
      requestFormatter({ requestUrl, requestOptions, response, err, body })
    );
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
  }: ActionParameters) {
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

  private handleUnauthorized(response: Response) {
    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }
  }
}
