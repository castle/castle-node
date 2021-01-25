import { ContextGetDefaultService } from '../../../src/context/context.module';
import { version } from '../../../package.json';

describe('ContextGetDefaultService', () => {
  describe('call', () => {
    const expected = {
      headers: {},
      library: {
        name: 'castle-node',
        version,
      },
      client_id: 'client_id',
    };

    const config = {
      apiSecret: 'test',
      apiUrl: 'castle.io',
    };

    const context = {
      client_id: 'client_id',
    };

    it('generates default context', () => {
      const received = ContextGetDefaultService.call(context, config);
      expect(received).toMatchObject(expected);
    });
  });
});
