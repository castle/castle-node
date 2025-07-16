import { APIBatchUpsertListItemsService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';
import { ListItemAuthorType, ListItemMode } from '../../../src/payload/models';

describe('APIBatchUpsertListItemsService', () => {
  const sampleRequestData = {
    list_id: 'e6baae3a-0636-441a-ba4f-c73f266c7a17',
    items: [
      {
        primary_value: 'A04t7AcfSA69cBTTusx0RQ',
        secondary_value: '2ee938c8-24c2-4c26-9d25-19511dd75029',
        comment: 'Fradulent user found through automated inspection',
        author: {
          type: '$other' as ListItemAuthorType,
          identifier: 'Security bot',
        },
        mode: '$error' as ListItemMode,
      },
    ],
  };

  describe('call', () => {
    it('handles batch upsert list item response', async () => {
      const apiResponse = {
        total_received: 1,
        total_processed: 1,
        created: 1,
        updated: 1,
        replaced: 1,
        errored: 1,
      };

      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/${sampleRequestData.list_id}/items/batch`,
          method: 'POST',
        },
        apiResponse
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIBatchUpsertListItemsService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(apiResponse);
    });
  });
});
