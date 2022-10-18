import { CommandGenerateService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuraton';
import MockDate from 'mockdate';
import AbortController from 'abort-controller';

describe('CommandGenerateService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: new URL('https://castle.io/v1/test'),
      requestOptions: {
        signal: controller.signal,
        method: 'GET',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
      },
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
    });

    const context = {
      ip: '127.0.0.1',
      headers: {
        'x-castle-client-id': 'client_id',
      },
    };

    it('generates payload', () => {
      const received = CommandGenerateService.call(
        controller,
        'test',
        { context },
        'GET',
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
