import fetch from 'node-fetch';
import { IncomingHttpHeaders } from 'http2';

const defaultApiUrl = 'https://api.castle.io';

export class Castle {
  private apiSecret: string;
  private apiUrl: string;
  private disableClientUserAgent: boolean;

  constructor({ apiSecret, apiUrl }: { apiSecret: string; apiUrl: string }) {
    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
  }

  //   event: '$login.succeeded',
  //   user_id: user.id,
  //   properties: {
  //     key: 'value'
  //   },
  //   user_traits: {
  //     key: 'value'
  //   }

  public trackEvent({
    event,
    user_id,
    user_traits,
    context,
  }: {
    event: string;
    user_id: string;
    user_traits: any;
    context: {
      ip: string;
      client_id: string;
      headers: IncomingHttpHeaders;
    };
  }) {
    if (!event) {
      throw new Error('Missing event');
    }

    return fetch(`${this.apiUrl}/v1/track`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${new Buffer(`test:${this.apiSecret}`).toString(
          'base64'
        )}`,
      },
      body: JSON.stringify({
        event,
        user_id,
        user_traits,
        context,
      }),
      // tslint:disable-next-line:no-console
    }).then(r => console.log(r));
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
