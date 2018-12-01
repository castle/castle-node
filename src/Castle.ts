import fetch from 'node-fetch';
import { IncomingHttpHeaders } from 'http2';
import { EVENTS } from './events';

const defaultApiUrl = 'https://api.castle.io';

type AuthenticateArguments = {
  user_id: string;
  user_traits: any;
  context: {
    ip: string;
    client_id: string;
    headers: IncomingHttpHeaders;
  };
};

type TrackParameters = {
  event: string;
} & AuthenticateArguments;

type AuthenticateResult = {
  action: string;
  user_id: string;
  device_token: string;
};

export class Castle {
  private apiSecret: string;
  private apiUrl: string;

  constructor({ apiSecret, apiUrl }: { apiSecret: string; apiUrl: string }) {
    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
  }

  public async authenticate({
    user_id,
    user_traits,
    context,
  }: AuthenticateArguments): Promise<AuthenticateResult> {
    const response = await fetch(`${this.apiUrl}/v1/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`test:${this.apiSecret}`).toString(
          'base64'
        )}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: EVENTS.LOGIN_SUCCEEDED,
        user_id,
        user_traits,
        context,
      }),
    });

    if (response.status !== 201) {
      throw new Error('Castle: Authentication request unsuccessful.');
    }

    return response.json();
  }

  public async trackEvent({
    event,
    user_id,
    user_traits,
    context,
  }: TrackParameters) {
    if (!event) {
      throw new Error('Missing event');
    }

    const response = await fetch(`${this.apiUrl}/v1/track`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`test:${this.apiSecret}`).toString(
          'base64'
        )}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        user_id,
        user_traits,
        context,
      }),
    });

    if (response.status !== 204) {
      throw new Error('Castle: Track request unsuccessful.');
    }
  }

  // public identify({
  //   user_id,
  //   user_data,
  //   headers = {},
  //   ip,
  //   cookie = '',
  //   userAgent = '',
  // }: {
  //   user_id: string;
  //   user_data: object;
  //   headers?: object;
  //   ip?: string;
  //   cookie?: string;
  //   userAgent?: string;
  // }) {
  //   return fetch(`${this.apiUrl}/v1/users/${user_id}`, {
  //     method: 'PUT',
  //     headers: {
  //       Authorization: `Basic ${new Buffer(`test:${this.apiSecret}`).toString(
  //         'base64'
  //       )}`,
  //     },
  //     body: JSON.stringify(user_data),
  //   });
  // }
}
