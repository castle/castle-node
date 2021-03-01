import { APIGetDeviceService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuraton';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIGetDeviceService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    device_token: 'device_token',
  };

  describe('call', () => {
    it('handles get devices response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {});

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIGetDeviceService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual({});
    });
  });
});
