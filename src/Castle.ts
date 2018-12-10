import fetch from 'node-fetch';
import { omit, pick } from 'lodash';
import { IncomingHttpHeaders } from 'http2';

const apiUrl = 'https://api.castle.io';

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
  user_id: string;
  device_token: string;
};

export class Castle {
  private apiSecret: string;
  private timeout: number;
  private allowedHeaders: string[];
  private disallowedHeaders: string[];
  private overrideFetch: any;

  constructor({
    apiSecret,
    timeout = 1000,
    allowedHeaders,
    disallowedHeaders,
    overrideFetch = fetch,
  }: {
    apiSecret: string;
    timeout?: number;
    allowedHeaders?: string[];
    disallowedHeaders?: string[];
    overrideFetch?: any;
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
  }

  public async authenticate(
    params: TrackParameters
  ): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    const response = await this.getFetch()(`${apiUrl}/v1/authenticate`, {
      method: 'POST',
      timeout: this.timeout,
      headers: this.generateDefaultRequestHeaders(),
      body: this.generateRequestBody(params),
    });

    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }

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

    const response = await this.getFetch()(`${apiUrl}/v1/track`, {
      method: 'POST',
      timeout: this.timeout,
      headers: this.generateDefaultRequestHeaders(),
      body: this.generateRequestBody(params),
    });

    this.handleUnauthorized(response);

    if (!response.ok) {
      throw new Error('Castle: `/track` request unsuccessful.');
    }
  }

  private getFetch() {
    return this.overrideFetch || fetch;
  }

  private scrubHeaders(headers: IncomingHttpHeaders) {
    let scrubbedHeaders;
    if (this.disallowedHeaders) {
      scrubbedHeaders = omit(headers, this.disallowedHeaders);
    }
    if (this.allowedHeaders) {
      scrubbedHeaders = pick(headers, this.allowedHeaders);
    }

    return {
      ...scrubbedHeaders,
      cookie: true,
    };
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

  private handleUnauthorized(response) {
    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }
  }
}
