import { APISearchListsService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APISearchListsService', () => {
  const sampleRequestData = {};

  describe('call', () => {
    it('handles search lists response', async () => {
      const apiResponse = [
        {
          primary_value: 'A04t7AcfSA69cBTTusx0RQ',
          secondary_value: '2ee938c8-24c2-4c26-9d25-19511dd75029',
          comment: 'Fradulent user found through manual inspection',
          author: {
            type: '$analyst_email',
            identifier: 'string',
          },
          auto_archives_at: '2021-09-27T16:46:38.313Z',
          id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
          list_id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
          archived: true,
          created_at: '2021-09-27T16:46:38.313Z',
        },
      ];

      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/query`,
          method: 'POST',
        },
        apiResponse
      );
      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APISearchListsService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(apiResponse);
    });
  });
});
