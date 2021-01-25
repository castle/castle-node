import { CoreGenerateRequestBody } from '../../../src/core/core.module';
import { version } from '../../../package.json';

describe('CoreGenerateRequestBody', () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2021-01-25T00:00:00.000Z').valueOf()
      );
  });

  describe('call', () => {
    const result = JSON.stringify({
      sent_at: '2021-01-25T00:00:00.000Z',
      event: '$login.succeeded',
      user_id: 'user_id',
      context: {
        ip: '127.0.0.1',
        client_id: 'client_id',
        headers: {},
        library: {
          name: 'castle-node',
          version,
        },
      },
    });

    const config = {
      apiSecret: 'test',
    };

    const payload = {
      event: '$login.succeeded',
      user_id: 'user_id',
      context: {
        ip: '127.0.0.1',
        client_id: 'client_id',
        headers: {},
      },
    };

    it('generates request body', () => {
      expect(CoreGenerateRequestBody.call(payload, config)).toEqual(result);
    });
  });
});
