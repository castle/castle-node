import { APIGetEventsSchemaService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';

describe('APIGetEventsSchemaService', () => {
  describe('call', () => {
    it('handles get events schema response', async () => {
      const fetch = fetchMock.sandbox().mock('*', {});

      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APIGetEventsSchemaService.call(config);
      expect(response).toEqual({});
    });
  });
});
