import { APIFetchListService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIFetchListService', () => {
  const sampleRequestData = {
    id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
  };

  describe('call', () => {
    it('handles fetch list response', async () => {
      const apiResponse = {
        name: 'Malicious IPs',
        description:
          'We block these IPs from withdrawing funds. Please be careful.',
        color: '$red',
        default_item_archivation_time: 2592000,
        id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
        primary_field: 'device.fingerprint',
        secondary_field: 'ip.value',
        archived_at: '2021-09-27T16:46:38.313Z',
        created_at: '2021-09-27T16:46:38.313Z',
      };

      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/lists/${sampleRequestData.id}`,
          method: 'GET',
        },
        apiResponse
      );

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIFetchListService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(apiResponse);
    });
  });
});
