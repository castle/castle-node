import { CoreProcessResponseService } from '../../../src/core/core.module';
import { version } from '../../../package.json';
import { Configuration } from '../../../src/configuraton';

import pino from 'pino';
import { Response } from 'node-fetch';

describe('CoreProcessResponseService', () => {
  describe('call', () => {
    describe('when success', () => {
      const response = new Response(JSON.stringify({ user: 1 }), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      });

      it('generates request body', async () => {
        expect(
          await CoreProcessResponseService.call(
            'authenticate',
            {},
            response,
            pino({ enabled: false })
          )
        ).toEqual({ user: 1 });
      });
    });
  });
});
