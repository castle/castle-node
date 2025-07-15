import { APIGroupEventsService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIGroupEventsService', () => {
  describe('call', () => {
    it('handles group events response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {});

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIGroupEventsService.call(
        {
          filters: [],
          group_by: {
            fields: [],
          },
          columns: [],
        },
        config
      );
      expect(response).toEqual({});
    });
  });
});
