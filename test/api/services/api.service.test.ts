import { APIService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import { CommandRiskService } from '../../../src/command/services';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';

describe('APIService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  const sampleRequestData: any = {
    event: '$login',
    request_token: 'token',
    status: '$succeeded',
    user: {
      id: 'userid',
      email: 'myemail',
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

        const command = CommandRiskService.call(
          controller,
          sampleRequestData,
          configuration
        );
        await expect(
          APIService.call(controller, command, configuration)
        ).rejects.toThrow('The request was aborted.');
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

        const command = CommandRiskService.call(
          controller,
          sampleRequestData,
          configuration
        );
        await expect(
          APIService.call(controller, command, configuration)
        ).rejects.toThrow('Castle: Responded with 400 code');
      });
    });
  });
});
