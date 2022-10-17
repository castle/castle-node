import { CoreGenerateRequestBody } from '../../../src/core/core.module';
import MockDate from 'mockdate';

describe('CoreGenerateRequestBody', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const result = JSON.stringify({
      sent_at: '2021-01-25T00:00:00.000Z',
      event: '$login.succeeded',
      user_id: 'user_id',
      context: {
        ip: '127.0.0.2',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'x-castle-client-id': 'client_id',
        },
      },
    });

    const payload = {
      event: '$login.succeeded',
      user_id: 'user_id',
      context: {
        ip: '127.0.0.2',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'x-castle-client-id': 'client_id',
        },
      },
    };

    it('generates request body', () => {
      expect(CoreGenerateRequestBody.call(payload)).toEqual(result);
    });
  });
});
