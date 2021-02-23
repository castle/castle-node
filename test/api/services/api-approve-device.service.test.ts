import { APIApproveDeviceService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuraton';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';
import pino from 'pino';

describe('APIApproveDeviceService', () => {
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
        logger: pino({ enabled: false }),
      });

      const response = await APIApproveDeviceService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual({});
    });
  });
});
