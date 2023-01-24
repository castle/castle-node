import { APITrackService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APITrackService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    event: '$login.succeeded',
    created_at: 'now',
    user_id: 'userid',
    user_traits: {
      email: 'myemail',
      updated_at: 'today',
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

      const response = await APITrackService.call(sampleRequestData, config);
      expect(response).toBeUndefined();
    });
  });
});
