import fetch from 'node-fetch';
import { IncomingHttpHeaders } from 'http2';

const defaultApiUrl = 'https://api.castle.io';

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
  private apiUrl: string;

  constructor({ apiSecret, apiUrl }: { apiSecret: string; apiUrl: string }) {
    if (!apiSecret) {
      throw new Error('Castle: API secret is missing.');
    }

    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
  }

  public async authenticate({
    event,
    user_id,
    user_traits,
    context,
  }: TrackParameters): Promise<AuthenticateResult> {
    if (!event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    const response = await this.createRequest(
      `${this.apiUrl}/v1/authenticate`,
      {
        method: 'POST',
        body: JSON.stringify({
          sent_at: new Date().toISOString(),
          event,
          user_id,
          user_traits,
          context: {
            ...context,
            headers: this.scrubHeaders(context.headers),
          },
        }),
      }
    );

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

  public async track({
    event,
    user_id,
    user_traits,
    context,
  }: TrackParameters) {
    if (!event) {
      throw new Error('Castle: event is required when calling track.');
    }

    const response = await this.createRequest(`${this.apiUrl}/v1/track`, {
      method: 'POST',
      body: JSON.stringify({
        sent_at: new Date().toISOString(),
        event,
        user_id,
        user_traits,
        context: {
          ...context,
          headers: this.scrubHeaders(context.headers),
        },
      }),
    });

    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }

    if (response.status !== 204) {
      throw new Error('Castle: `/track` request unsuccessful.');
    }
  }

  private createRequest(url: string, options: any) {
    return fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`:${this.apiSecret}`).toString(
          'base64'
        )}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });
  }

  private scrubHeaders(headers: IncomingHttpHeaders) {
    return {
      ...headers,
      cookie: true,
    };
  }
}
