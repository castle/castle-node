import { createHmac } from 'crypto';
import { WebhookVerifyService } from '../../../src/webhook/webhook.module';
import { Configuration } from '../../../src/configuration';
import { WebhookVerificationError } from '../../../src/errors';

const apiSecret = 'some secret';
const configuration = new Configuration({ apiSecret });

const sign = (payload: string): string =>
  createHmac('sha256', apiSecret).update(payload).digest('base64');

describe('WebhookVerifyService', () => {
  describe('call', () => {
    it('passes for a valid signature', () => {
      const payload = '{"type":"$incident.confirmed"}';

      expect(() =>
        WebhookVerifyService.call(payload, sign(payload), configuration)
      ).not.toThrow();
    });

    it('accepts a Buffer payload', () => {
      const payload = Buffer.from('{"type":"$review.opened"}');

      expect(() =>
        WebhookVerifyService.call(
          payload,
          sign(payload.toString()),
          configuration
        )
      ).not.toThrow();
    });

    it('throws when the signature does not match', () => {
      expect(() =>
        WebhookVerifyService.call('{"a":1}', 'wrong-signature', configuration)
      ).toThrow(WebhookVerificationError);
    });

    it('throws when the signature is missing', () => {
      expect(() =>
        WebhookVerifyService.call('{"a":1}', undefined, configuration)
      ).toThrow(WebhookVerificationError);
    });

    it('throws for an empty payload', () => {
      expect(() =>
        WebhookVerifyService.call('', sign(''), configuration)
      ).toThrow(WebhookVerificationError);
    });
  });
});
