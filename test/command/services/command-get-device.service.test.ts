import { CommandGetDeviceService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandGetDeviceService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: new URL('https://castle.io/v1/devices/device_token'),
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
      device_token: 'device_token',
    };

    it('generates payload', () => {
      const received = CommandGetDeviceService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
