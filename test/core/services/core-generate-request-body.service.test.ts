import { CoreGenerateRequestBody } from '../../../src/core/core.module';
import { version } from '../../../package.json';
import MockDate from 'mockdate';
import { Configuration } from '../../../src/configuraton';

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
        ip: '127.0.0.1',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'x-castle-client-id': 'client_id',
        },
        client_id: 'client_id',
        active: true,
        library: {
          name: 'castle-node',
          version,
        },
      },
    });

    const config = new Configuration({
      apiSecret: 'test',
    });

    const payload = {
      event: '$login.succeeded',
      user_id: 'user_id',
      context: {
        ip: '127.0.0.1',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'x-castle-client-id': 'client_id',
        },
      },
    };

    it('generates request body', () => {
      expect(CoreGenerateRequestBody.call(payload, config)).toEqual(result);
    });
  });
});
