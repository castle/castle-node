import { PayloadPrepareService } from '../../../src/payload/payload.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';

describe('PayloadPrepareService', () => {
  describe('call', () => {
    const expected = {
      context: {
        library: {
          name: 'castle-node-overwritten',
          version,
        },
        client_id: '123',
        active: true,
      },
      user_id: '123',
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
      denylisted: [],
      allowlisted: [],
    });

    const payloadOptions = {
      user_id: '123',
      context: {
        client_id: '123',
        library: {
          name: 'castle-node-overwritten',
        },
      },
    };

    const mockRequest = {
      headers: {},
      body: {},
    } as Request;

    it('generates payload', () => {
      const received = PayloadPrepareService.call(
        payloadOptions,
        mockRequest,
        config
      );
      expect(received).toMatchObject(expected);
    });
  });
});
