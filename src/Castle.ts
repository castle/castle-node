import fetch from 'node-fetch';
import { reduce } from 'lodash';
import { IncomingHttpHeaders } from 'http2';
import AbortController from 'abort-controller';
import packageJson from '../package.json';

const defaultApiUrl = 'https://api.castle.io';

type TrackParameters = {
  event: string;
  user_id: string;
  user_traits?: object;
  properties?: object;
  created_at?: string;
  context: {
    ip: string;
    client_id: string;
    headers: IncomingHttpHeaders;
  };
};

type AuthenticateResult = {
  action: string;
  user_id?: string;
  device_token?: string;
  failover?: boolean;
  failover_reason?: string;
};

const isTimeout = (e: Error) => e.name === 'AbortError';

export class Castle {
  private apiSecret: string;
  private apiUrl: string;
  private timeout: number;
  private allowedHeaders: string[];
  private disallowedHeaders: string[];
  private overrideFetch: any;
  private failoverStrategy: string;

  constructor({
    apiSecret,
    apiUrl,
    timeout = 500,
    allowedHeaders = [],
    disallowedHeaders = [],
    overrideFetch = fetch,
    failoverStrategy = 'allow',
  }: {
    apiSecret: string;
    apiUrl?: string;
    timeout?: number;
    allowedHeaders?: string[];
    disallowedHeaders?: string[];
    overrideFetch?: any;
    failoverStrategy?: string;
  }) {
    if (!apiSecret) {
      throw new Error(
        'Castle: Unable to instantiate Castle client, API secret is missing.'
      );
    }

    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
    this.timeout = timeout;
    this.allowedHeaders = allowedHeaders;
    this.disallowedHeaders = disallowedHeaders.concat(['Cookie']);
    this.overrideFetch = overrideFetch;
    this.failoverStrategy = failoverStrategy;
  }

  public async authenticate(
    params: TrackParameters
  ): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      response = await this.getFetch()(`${this.apiUrl}/v1/authenticate`, {
        signal: controller.signal,
        method: 'POST',
        headers: this.generateDefaultRequestHeaders(),
        body: this.generateRequestBody(params),
      });
    } catch (e) {
      if (isTimeout(e)) {
        return {
          action: this.failoverStrategy,
          failover: true,
          failover_reason: 'timeout',
          user_id: params.user_id,
        };
      } else {
        throw e;
      }
    } finally {
      clearTimeout(timeout);
    }

    this.handleUnauthorized(response);

    if (!response.ok) {
      throw new Error(
        `Castle: \`/authenticate\` request unsuccessful. Expected ok result, got ${
          response.status
        }`
      );
    }

    return response.json();
  }

  public async track(params: TrackParameters) {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      response = await this.getFetch()(`${this.apiUrl}/v1/track`, {
        signal: controller.signal,
        method: 'POST',
        headers: this.generateDefaultRequestHeaders(),
        body: this.generateRequestBody(params),
      });
    } catch (e) {
      if (isTimeout(e)) {
        // tslint:disable-next-line:no-console
        console.error(
          `Castle: an exception occured while tracking ${
            params.event
          } event. Request timed out.`
        );
        return;
      }
    } finally {
      clearTimeout(timeout);
    }

    this.handleUnauthorized(response);

    if (!response.ok) {
      throw new Error('Castle: `/track` request unsuccessful.');
    }
  }

  private getFetch() {
    return this.overrideFetch || fetch;
  }

  private scrubHeaders(headers: IncomingHttpHeaders) {
    return reduce(
      headers,
      (accumulator: object, value: string, key: string) => {
        if (this.disallowedHeaders.includes(key)) {
          return {
            ...accumulator,
            [key]: true,
          };
        }
        if (this.allowedHeaders.length && !this.allowedHeaders.includes(key)) {
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
      Authorization: `Basic ${Buffer.from(`test:${this.apiSecret}`).toString(
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
  }: TrackParameters) {
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      properties,
      context: {
        ...context,
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
