import { createHmac } from 'crypto';
import { Configuration } from '../../configuration';

export const SecureModeService = {
  // Computes the secure-mode signature for a user id: a hex HMAC-SHA256 of the
  // user id keyed with the API secret. Use it to authenticate the user id sent
  // to Castle from the browser.
  call: (userId: string, configuration: Configuration): string =>
    createHmac('sha256', configuration.apiSecret).update(userId).digest('hex'),
};
