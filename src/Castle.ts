import fetch from 'node-fetch';
import { reduce } from 'lodash';
import { IncomingHttpHeaders } from 'http2';

const apiUrl = 'https://api.castle.com';

type TrackParameters = {
  event: string;
  user_id: string;
  user_traits: any;
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

export class Castle {
  private apiSecret: string;
  private timeout: number;
  private allowedHeaders: string[];
  private disallowedHeaders: string[];
  private overrideFetch: any;
  private failoverStrategy: string;

  constructor({
    apiSecret,
    timeout = 1000,
    allowedHeaders = [],
    disallowedHeaders = [],
    overrideFetch = fetch,
    failoverStrategy = 'allow',
  }: {
    apiSecret: string;
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
    this.timeout = timeout;
    this.allowedHeaders = allowedHeaders;
    this.disallowedHeaders = disallowedHeaders;
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

    try {
      response = await this.getFetch()(`${apiUrl}/v1/authenticate`, {
        method: 'POST',
        timeout: this.timeout,
        headers: this.generateDefaultRequestHeaders(),
        body: this.generateRequestBody(params),
      });
    } catch (e) {
      if (e.message.startsWith('network timeout')) {
        return {
          action: this.failoverStrategy,
          failover: true,
          failover_reason: 'timeout',
        };
      } else {
        throw e;
      }
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

    try {
      response = await this.getFetch()(`${apiUrl}/v1/track`, {
        method: 'POST',
        timeout: this.timeout,
        headers: this.generateDefaultRequestHeaders(),
        body: this.generateRequestBody(params),
      });
    } catch (e) {
      if (e.message.startsWith('network timeout')) {
        // tslint:disable-next-line:no-console
        console.error(
          `Castle: an exception occured while tracking ${
            params.event
          } event. Request timed out.`
        );
        return;
      }
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
          return accumulator;
        }
        if (this.allowedHeaders.length && !this.allowedHeaders.includes(key)) {
          return accumulator;
        }

        return {
          ...accumulator,
          [key]: true,
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
    context,
    created_at,
  }: TrackParameters) {
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      context: {
        ...context,
        headers: this.scrubHeaders(context.headers),
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
