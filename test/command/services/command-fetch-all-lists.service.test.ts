import { CommandFetchAllListsService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandFetchAllListsService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const expected = {
      requestUrl: new URL(`https://castle.io/v1/lists`),
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

    it('generates payload', () => {
      const received = CommandFetchAllListsService.call(controller, config);
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
