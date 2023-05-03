import { CommandSearchListsService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandSearchLists', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const options = {};

    const expected = {
      requestUrl: new URL(`https://castle.io/v1/lists/query`),
      requestOptions: {
        signal: controller.signal,
        method: 'POST',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sent_at: '2023-04-15T00:00:00.000Z',
          ...options,
        }),
      },
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
    });

    it('generates payload', () => {
      const received = CommandSearchListsService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
