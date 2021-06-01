import { APIAuthenticateService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuraton';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIAuthenticateService', () => {
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
    it('handles allow response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'allow',
        device_token: 'device_token',
        user_id: 'user_id',
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIAuthenticateService.call(
        sampleRequestData,
        config
      );
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device_token', 'device_token');
      expect(response).toHaveProperty('user_id', 'user_id');
    });

    it('handles deny response without risk policy', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'deny',
        device_token: 'device_token',
        user_id: 'user_id',
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIAuthenticateService.call(
        sampleRequestData,
        config
      );
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('device_token', 'device_token');
      expect(response).toHaveProperty('user_id', 'user_id');
    });

    it('handles deny response with risk policy', async () => {
      const fetch = fetchMock.sandbox().mock('*', {
        action: 'deny',
        device_token: 'device_token',
        user_id: 'user_id',
        risk_policy: {
          id: 'q-rbeMzBTdW2Fd09sbz55A',
          revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
          name: 'Block Users from X',
          type: 'bot',
        },
      });

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIAuthenticateService.call(
        sampleRequestData,
        config
      );
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('device_token', 'device_token');
      expect(response).toHaveProperty('user_id', 'user_id');
      expect(response.risk_policy).toHaveProperty(
        'id',
        'q-rbeMzBTdW2Fd09sbz55A'
      );
      expect(response.risk_policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.risk_policy).toHaveProperty('type', 'bot');
      expect(response.risk_policy).toHaveProperty('name', 'Block Users from X');
    });
  });
});
