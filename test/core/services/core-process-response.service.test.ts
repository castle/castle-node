import { CoreProcessResponseService } from '../../../src/core/core.module';
import pino from 'pino';
import { Response } from 'node-fetch';

describe('CoreProcessResponseService', () => {
  describe('call', () => {
    describe('authenticate', () => {
      describe('when success', () => {
        const result = { user: 1 };
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
          ).toEqual(result);
        });
      });

      describe('when allow without additional props', () => {
        const result = { action: 'allow', user_id: '12345' };
        const response = new Response(JSON.stringify(result), {
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
          ).toEqual(result);
        });
      });

      describe('when allow with additional props', () => {
        const result = { action: 'allow', user_id: '12345', internal: {} };
        const response = new Response(JSON.stringify(result), {
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
          ).toEqual(result);
        });
      });

      describe('when deny without risk policy', () => {
        const result = { action: 'deny', user_id: '1', device_token: 'abc' };
        const response = new Response(JSON.stringify(result), {
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
          ).toEqual(result);
        });
      });

      describe('when deny with risk policy', () => {
        const result = {
          action: 'deny',
          user_id: '1',
          device_token: 'abc',
          risk_policy: {
            id: '123',
            revision_id: 'abc',
            name: 'def',
            type: 'bot',
          },
        };
        const response = new Response(JSON.stringify(result), {
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
          ).toEqual(result);
        });
      });

      describe('when response empty', () => {
        const result = { };
        const response = new Response(JSON.stringify(''), {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        });

        it('generates empty request body', async () => {
          expect(
            await CoreProcessResponseService.call(
              'authenticate',
              {},
              response,
              pino({ enabled: false })
            )
          ).toEqual(result);
        });
      });

      describe('when response undefined', () => {
        const result = { };
        const response = new Response(undefined, {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        });

        it('generates empty request body', async () => {
          expect(
            await CoreProcessResponseService.call(
              'authenticate',
              {},
              response,
              pino({ enabled: false })
            )
          ).toEqual(result);
        });
      });

      describe('when JSON is malformed', () => {
        const result = { };
        const response = new Response('{a', {
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
          ).toEqual(result);
        });
      });
    });
  });
});
