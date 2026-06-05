import { ContextGetDefaultService } from '../../../src/context/context.module';
import { Configuration } from '../../../src/configuration';
import { version } from '../../../package.json';
import type { Request as ExpressRequest } from 'express';

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
      baseUrl: 'https://castle.io/v1',
      denylisted: [],
      allowlisted: [],
    });

    const mockRequest = {
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'x-castle-client-id': 'client_id',
        cookies: 'client_id',
      },
      body: {},
    } as ExpressRequest;

    it('generates default context', () => {
      const received = ContextGetDefaultService.call(
        mockRequest,
        undefined,
        config
      );
      expect(received).toMatchObject(expected);
    });

    describe('when no forwarding header is present', () => {
      const socketRequest = {
        headers: {
          'x-castle-client-id': 'client_id',
        },
        socket: { remoteAddress: '8.8.8.8' },
      } as unknown as ExpressRequest;

      it('derives the ip from the socket peer address', () => {
        const received = ContextGetDefaultService.call(
          socketRequest,
          undefined,
          config
        );
        expect(received).toMatchObject({ ip: '8.8.8.8' });
      });
    });
  });
});
