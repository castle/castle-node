import { CoreProcessResponseService } from '../../../src/core/core.module';
import { Response } from 'node-fetch';
import {
  APIError,
  InvalidRequestTokenError,
  RateLimitError,
} from '../../../src/errors';

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
              { info: () => {} }
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
              { info: () => {} }
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
              { info: () => {} }
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
              { info: () => {} }
            )
          ).toEqual(result);
        });
      });

      describe('when deny with risk policy', () => {
        const result = {
          action: 'deny',
          user_id: '1',
          device_token: 'abc',
          policy: {
            id: '123',
            revision_id: 'abc',
            name: 'def',
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
              { info: () => {} }
            )
          ).toEqual(result);
        });
      });

      describe('when response empty', () => {
        const result = {};
        const response = new Response('', {
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
              { info: () => {} }
            )
          ).toEqual(result);
        });
      });

      describe('when JSON is malformed', () => {
        const response = new Response('{a', {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        });

        it('generates request body', async () => {
          await expect(
            CoreProcessResponseService.call('authenticate', {}, response, {
              info: () => {},
            })
          ).rejects.toThrowError('Castle: Malformed JSON response');
        });
      });
    });

    describe('erroneous response statuses', () => {
      const erroneousStatuses = [400, 401, 403, 404, 419, 422, 429];

      erroneousStatuses.forEach((errorStatus) => {
        describe(`when ${errorStatus}`, () => {
          const response = new Response(JSON.stringify({}), {
            headers: {
              'Content-Type': 'application/json',
            },
            status: errorStatus,
          });

          it('throws BadRequestError', async () => {
            await expect(
              CoreProcessResponseService.call('authenticate', {}, response, {
                info: () => {},
              })
            ).rejects.toThrowError(
              `Castle: Responded with ${errorStatus} code`
            );
          });
        });
      });

      describe('with invalid request token', () => {
        const response = new Response(
          JSON.stringify({
            type: 'invalid_request_token',
            message: 'Invalid Request Token',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 422,
          }
        );

        it('throws InvalidRequestTokenError', async () => {
          await expect(
            CoreProcessResponseService.call('risk', {}, response, {
              info: () => {},
            })
          ).rejects.toThrow(InvalidRequestTokenError);
        });
      });

      describe('when request is rate limited', () => {
        const response = new Response(
          JSON.stringify({
            type: 'rate_limit',
            message: 'Rate Limit Exceeded',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 429,
          }
        );

        it('throws RateLimitError', async () => {
          await expect(
            CoreProcessResponseService.call('risk', {}, response, {
              info: () => {},
            })
          ).rejects.toThrow(RateLimitError);
        });
      });

      describe('when unknown error is returned', () => {
        const response = new Response(
          JSON.stringify({
            type: 'unknown',
            message: 'Something bad happened',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
          }
        );

        it('throws APIError', async () => {
          await expect(
            CoreProcessResponseService.call('risk', {}, response, {
              info: () => {},
            })
          ).rejects.toThrow(APIError);
        });
      });
    });
  });
});
