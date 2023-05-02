import { CommandFetchListService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';
import { InvalidParametersError } from '../../../src/errors';

describe('CommandFetchListService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const options = {
      id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
    };

    const expected = {
      requestUrl: new URL(`https://castle.io/v1/lists/${options.id}`),
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
      const received = CommandFetchListService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });

    test.each(['id'])('throws if %s is missing from the payload', (prop) => {
      const invalidOptions = Object.assign({}, options);
      delete invalidOptions[prop];
      expect(() =>
        CommandFetchListService.call(controller, invalidOptions, config)
      ).toThrow(InvalidParametersError);
    });
  });
});
