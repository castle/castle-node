import { APITrackService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuraton';
import { EVENTS } from '../../../src/events';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';
import pino from 'pino';

describe('APITrackService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    event: EVENTS.LOGIN_SUCCEEDED,
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
      });

      const response = await APITrackService.call(
        sampleRequestData,
        config,
        pino({ enabled: false })
      );
      expect(response).toBeUndefined();
    });
  });
});
