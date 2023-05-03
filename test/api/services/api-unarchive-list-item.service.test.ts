import { APIUnarchiveListItemService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIUnarchiveListItemService', () => {
  const sampleRequestData = {
    list_id: 'e6baae3a-0636-441a-ba4f-c73f266c7a17',
    id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
  };

  describe('call', () => {
    it('handles unarchive list item response', async () => {
      const apiResponse = {};
      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/${sampleRequestData.list_id}/items/${sampleRequestData.id}/unarchive`,
          method: 'PUT',
        },
        apiResponse
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIUnarchiveListItemService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(response);
    });
  });
});
