import { APILogService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import type { LogPayload } from '../../../src/payload/payload.module';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APILogService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData: LogPayload = {
    event: '$login',
    request_token: 'token',
    status: '$succeeded',
    created_at: 'now',
    user: {
      id: 'userid',
      email: 'myemail',
    },
    context: {
      ip: '8.8.8.8',
      headers: {},
    },
  };

  describe('call', () => {
    it('handles track response', async () => {
      const fetch = fetchMock.sandbox().post('*', 204);

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APILogService.call(sampleRequestData, config);
      expect(response).toBeUndefined();
    });
  });
});
