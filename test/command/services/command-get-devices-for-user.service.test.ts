import { CommandGetDevicesForUserService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandGetDevicesForUserService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: new URL('https://castle.io/v1/users/user_id/devices'),
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

    const options = {
      user_id: 'user_id',
    };

    it('generates payload', () => {
      const received = CommandGetDevicesForUserService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
