import { APIRequestUserDataService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIRequestUserDataService', () => {
  const sampleRequestData = {
    identifier: 'user@example.com',
    identifier_type: '$email' as const,
  };

  describe('call', () => {
    it('handles request user data response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {});

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIRequestUserDataService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual({});
    });
  });
});
