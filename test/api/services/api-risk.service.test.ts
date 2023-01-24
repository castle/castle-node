import { APIRiskService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIRiskService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    event: '$login',
    request_token: 'token',
    status: '$succeeded',
    user: {
      id: 'userid',
      email: 'myemail',
      traits: {
        email: 'myemail',
        updated_at: 'today',
      },
    },
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

      const response = await APIRiskService.call(sampleRequestData, config);
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

      const response = await (<any>(
        APIRiskService.call(sampleRequestData, config)
      ));
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
        APIRiskService.call(sampleRequestData, config)
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
  });
});
