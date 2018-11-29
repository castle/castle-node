import * as os from 'os';
import * as process from 'process';
import packageJson from '../package.json';
import { omitBy } from 'lodash';

const defaultApiUrl = 'https://api.castle.io';

export class Castle {
  private apiSecret: string;
  private apiUrl: string;
  private disableClientUserAgent: boolean;

  constructor({ apiSecret, apiUrl }: { apiSecret: string; apiUrl: string }) {
    this.apiSecret = apiSecret;
    this.apiUrl = apiUrl || defaultApiUrl;
  }

  public trackEvent({
    event,
    user_id,
    details,
    headers = {},
    ip,
    cookie = '',
    userAgent = '',
  }: {
    event: string;
    user_id: string;
    details: object;
    headers?: object;
    ip?: string;
    cookie?: string;
    userAgent?: string;
  }) {
    if (!event) {
      throw new Error('Missing event');
    }

    return fetch(`${this.apiUrl}/v1/events`, {
      cache: 'no-cache',
      method: 'POST',
      headers: this.generateHeaders(headers, ip, cookie, userAgent),
      body: JSON.stringify({
        name: event,
        user_id,
        details,
      }),
    });
  }

  public identify({
    user_id,
    user_data,
    headers = {},
    ip,
    cookie = '',
    userAgent = '',
  }: {
    user_id: string;
    user_data: object;
    headers?: object;
    ip?: string;
    cookie?: string;
    userAgent?: string;
  }) {
    return fetch(`${this.apiUrl}/v1/users/${user_id}`, {
      cache: 'no-cache',
      method: 'PUT',
      headers: this.generateHeaders(headers, ip, cookie, userAgent),
      body: JSON.stringify(user_data),
    });
  }

  private generateHeaders(
    clientHeaders: object,
    ip: string,
    cookie: string,
    userAgent: string
  ) {
    return omitBy(
      {
        Authorization: `Basic ${this.apiSecret}`,
        'Content-Type': 'application/json; charset=utf-8',
        'X-Castle-Client-User-Agent': this.disableClientUserAgent
          ? undefined
          : JSON.stringify(this.getClientUserAgent()),
        'X-Castle-Cookie-Id': cookie,
        'X-Castle-Headers': JSON.stringify(clientHeaders),
        'X-Castle-Ip': ip,
        'X-Castle-User-Agent': userAgent,
      },
      value => !value
    );
  }

  private getClientUserAgent() {
    return {
      bindings_version: packageJson.version,
      lang: 'Node.js',
      lang_version: process.version,
      platform: os.platform(),
      publisher: 'castle',
    };
  }
}
