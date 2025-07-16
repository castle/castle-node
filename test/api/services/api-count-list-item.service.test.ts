import { APICountListItemsService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APICountListItemsService', () => {
  const sampleRequestData = {
    list_id: 'e6baae3a-0636-441a-ba4f-c73f266c7a17',
    filters: [],
  };

  describe('call', () => {
    it('handles count list item response', async () => {
      const apiResponse = {
        total_count: 1,
      };

      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/${sampleRequestData.list_id}/items/count`,
          method: 'POST',
        },
        apiResponse
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APICountListItemsService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(apiResponse);
    });
  });
});
