import { ContextGetDefaultService } from '../../../src/context/context.module';
import { version } from '../../../package.json';

describe('ContextGetDefaultService', () => {
  describe('call', () => {
    const expected = {
      headers: {
        'x-forwarded-for': '1.2.3.4',
      },
      library: {
        name: 'castle-node',
        version,
      },
      client_id: 'client_id',
      ip: '1.2.3.4',
    };

    const config = {
      apiSecret: 'test',
      apiUrl: 'castle.io',
      denylisted: [],
      allowlisted: [],
    };

    const context = {
      client_id: 'client_id',
      headers: {
        'x-forwarded-for': '1.2.3.4',
      },
    };

    it('generates default context', () => {
      const received = ContextGetDefaultService.call(context, config);
      expect(received).toMatchObject(expected);
    });
  });
});
