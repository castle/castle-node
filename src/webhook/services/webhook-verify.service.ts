import { createHmac, timingSafeEqual } from 'crypto';
import { Configuration } from '../../configuration';
import { WebhookVerificationError } from '../../errors';

const secureCompare = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
};

export const WebhookVerifyService = {
  // Verifies the `X-Castle-Signature` of an incoming webhook against the raw
  // request body. Throws `WebhookVerificationError` when it does not match.
  call: (
    payload: string | Buffer,
    signature: string | undefined,
    configuration: Configuration
  ): void => {
    if (!payload || payload.length === 0) {
      throw new WebhookVerificationError('Invalid webhook from Castle API');
    }

    const expectedSignature = createHmac('sha256', configuration.apiSecret)
      .update(payload)
      .digest('base64');

    if (!signature || !secureCompare(signature, expectedSignature)) {
      throw new WebhookVerificationError(
        'Signature not matching the expected signature'
      );
    }
  },
};
