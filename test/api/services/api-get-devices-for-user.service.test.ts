import { APIGetDevicesForUserService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuraton';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIGetDevicesForUserService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    user_id: 'userid',
  };

  describe('call', () => {
    it('handles get devices response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {});

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIGetDevicesForUserService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual({});
    });
  });
});
