import fetch from 'node-fetch';
import { IncomingHttpHeaders } from 'http2';

const apiUrl = 'https://api.castle.io';

type TrackParameters = {
  event: string;
  user_id: string;
  user_traits: any;
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

  constructor({
    apiSecret,
    timeout = 1000,
  }: {
    apiSecret: string;
    timeout: number;
  }) {
    if (!apiSecret) {
      throw new Error('Castle: API secret is missing.');
    }

    this.apiSecret = apiSecret;
    this.timeout = timeout;
  }

  public async authenticate(
    params: TrackParameters
  ): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    const response = await fetch(`${apiUrl}/v1/authenticate`, {
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

    if (response.status !== 201) {
      throw new Error('Castle: `/authenticate` request unsuccessful.');
    }

    return response.json();
  }

  public async track(params: TrackParameters) {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
    }

    const response = await fetch(`${apiUrl}/v1/track`, {
      method: 'POST',
      timeout: this.timeout,
      headers: this.generateDefaultRequestHeaders(),
      body: this.generateRequestBody(params),
    });

    this.handleUnauthorized(response);

    if (response.status !== 204) {
      throw new Error('Castle: `/track` request unsuccessful.');
    }
  }

  private scrubHeaders(headers: IncomingHttpHeaders) {
    return {
      ...headers,
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
  }: TrackParameters) {
    return JSON.stringify({
      sent_at: new Date().toISOString(),
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
