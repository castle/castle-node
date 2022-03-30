import { ContextPrepareService } from '../../../src/context/context.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';
import type { Request as ExpressRequest } from 'express';

describe('ContextPrepareService', () => {
  describe('call', () => {
    const expected = {
      library: {
        name: 'castle-node',
        version,
      },
      client_id: 'client_id',
      active: true,
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
      denylisted: [],
      allowlisted: [],
    });

    const options = {
      cookies: '__cid=abcd;',
      context: {
        client_id: 'client_id',
        active: true,
      },
    };

    const mockRequest = {
      headers: {},
      body: {},
    } as ExpressRequest;

    it('generates context', () => {
      const received = ContextPrepareService.call(mockRequest, options, config);
      expect(received).toMatchObject(expected);
    });
  });
});
