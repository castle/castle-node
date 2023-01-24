import { APIFilterService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import { FailoverStrategy } from '../../../src/failover/models';
import type { FilterPayload } from '../../../src/payload/payload.module';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIFilterService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData: FilterPayload = {
    event: '$login',
    request_token: 'token',
    status: '$failed',
    matching_user_id: 'userid',
    context: {
      ip: '8.8.8.8',
      headers: {},
    },
  };

  describe('call', () => {
    it('handles allow response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'allow',
        risk: 0.85,
        device: { token: 'device_token' },
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await (<any>(
        APIFilterService.call(sampleRequestData, config)
      ));
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device.token', 'device_token');
    });

    it('handles deny response without risk policy', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'deny',
        risk: 0.85,
        device: { token: 'device_token' },
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIFilterService.call(sampleRequestData, config);
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('device.token', 'device_token');
    });

    it('handles deny response with risk policy', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'deny',
        device: {
          token: 'device_token',
        },
        policy: {
          id: 'q-rbeMzBTdW2Fd09sbz55A',
          revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
          name: 'Block Users from X',
        },
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await (<any>(
        APIFilterService.call(sampleRequestData, config)
      ));
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('device.token', 'device_token');
      expect(response.policy).toHaveProperty('id', 'q-rbeMzBTdW2Fd09sbz55A');
      expect(response.policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.policy).toHaveProperty('name', 'Block Users from X');
    });

    it('handles timeouts with failover strategy', async () => {
      jest.useFakeTimers();
      const fetch = fetchMock.sandbox().mock(
        '*',
        {
          action: 'deny',
          device: {
            token: 'device_token',
          },
          policy: {
            id: 'q-rbeMzBTdW2Fd09sbz55A',
            revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
            name: 'Block Users from X',
          },
        },
        {
          delay: 2000,
        }
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        failoverStrategy: FailoverStrategy.allow,
        timeout: 1000,
        logger: { info: () => {} },
      });

      const filterCall = <any>APIFilterService.call(sampleRequestData, config);
      jest.runAllTimers();

      const response = await filterCall;

      expect(response).toEqual({
        policy: {
          action: 'allow',
        },
        action: 'allow',
        failover: true,
        failover_reason: 'timeout',
      });

      jest.useRealTimers();
    });
  });
});
