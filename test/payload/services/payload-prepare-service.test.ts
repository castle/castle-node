import { PayloadPrepareService } from '../../../src/payload/payload.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';

describe('PayloadPrepareService', () => {
  describe('call', () => {
    const expected = {
      library: {
        name: 'castle-node',
        version,
      },
      client_id: '123',
      active: true,
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
      denylisted: [],
      allowlisted: [],
    });

    const payloadOptions = {
      client_id: 'client_id',
      active: true,
    };

    const requestContext = {
      client_id: '123',
    };

    it('generates payload', () => {
      const received = PayloadPrepareService.call(
        payloadOptions,
        requestContext,
        config
      );
      expect(received).toMatchObject(expected);
    });
  });
});
