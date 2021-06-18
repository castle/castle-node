import { ContextPrepareService } from '../../../src/context/context.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';

describe('ContextPrepareService', () => {
  describe('call', () => {
    const expected = {
      library: {
        name: 'castle-node',
        version,
      },
      client_id: 'abcd',
      active: true,
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
      denylisted: [],
      allowlisted: [],
    });

    const context = {
      client_id: 'client_id',
      active: true,
    };

    const options = {
      cookies: '__cid=abcd;',
    };

    it('generates context', () => {
      const received = ContextPrepareService.call(context, options, config);
      expect(received).toMatchObject(expected);
    });
  });
});
