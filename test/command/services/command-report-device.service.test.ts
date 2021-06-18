import { CommandReportDeviceService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandReportDeviceService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: new URL('https://castle.io/v1/devices/device_token/report'),
      requestOptions: {
        signal: controller.signal,
        method: 'PUT',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sent_at: '2021-01-25T00:00:00.000Z',
          context: {
            library: {
              name: 'castle-node',
              version,
            },
          },
        }),
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
      const received = CommandReportDeviceService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
