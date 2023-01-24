import { APIService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import { CommandAuthenticateService } from '../../../src/command/services';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';
import AbortController from 'abort-controller';

describe('APIService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData = {
    event: '$login.succeeded',
    created_at: 'now',
    user_id: 'userid',
    user_traits: {
      email: 'myemail',
      updated_at: 'today',
    },
    context: {
      ip: '8.8.8.8',
      headers: {},
    },
  };

  describe('call', () => {
    const controller = new AbortController();

    describe('when request timeouts', () => {
      it('returns error', async () => {
        const abortError = new Error();
        abortError.name = 'AbortError';
        abortError.message = 'The request was aborted.';

        const fetch = fetchMock.sandbox().mock('*', { throws: abortError });
        const configuration = new Configuration({
          apiSecret: 'test',
          overrideFetch: fetch,
          logger: { info: () => {} },
        });

        const command = CommandAuthenticateService.call(
          controller,
          sampleRequestData,
          configuration
        );
        await expect(
          APIService.call(controller, command, configuration)
        ).rejects.toThrowError('The request was aborted.');
      });
    });

    describe('when non-OK response', () => {
      it('returns error', async () => {
        const fetch = fetchMock.sandbox().mock('*', { status: 400 });
        const configuration = new Configuration({
          apiSecret: 'test',
          overrideFetch: fetch,
          logger: { info: () => {} },
        });

        const command = CommandAuthenticateService.call(
          controller,
          sampleRequestData,
          configuration
        );
        await expect(
          APIService.call(controller, command, configuration)
        ).rejects.toThrowError('Castle: Responded with 400 code');
      });
    });
  });
});
