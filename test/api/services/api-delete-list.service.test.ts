import { APIDeleteListService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIDeleteListService', () => {
  const sampleRequestData = {
    id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
  };

  describe('call', () => {
    it('handles archive list item response', async () => {
      const apiResponse = {};
      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/${sampleRequestData.id}`,
          method: 'DELETE',
        },
        apiResponse
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIDeleteListService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(response);
    });
  });
});
