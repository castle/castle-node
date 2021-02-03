import { ContextGetDefaultService } from '../../../src/context/context.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';

describe('ContextGetDefaultService', () => {
  describe('call', () => {
    const expected = {
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'x-castle-client-id': 'client_id',
      },
      library: {
        name: 'castle-node',
        version,
      },
      client_id: 'client_id',
      ip: '1.2.3.4',
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io',
      denylisted: [],
      allowlisted: [],
    });

    const context = {
      client_id: 'client_id',
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'x-castle-client-id': 'client_id',
      },
    };

    it('generates default context', () => {
      const received = ContextGetDefaultService.call(context, config);
      expect(received).toMatchObject(expected);
    });
  });
});
