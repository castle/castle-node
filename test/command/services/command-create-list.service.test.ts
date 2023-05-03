import { CommandCreateListService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import MockDate from 'mockdate';

describe('CommandCreateList', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const options = {
      name: 'Malicious IPs',
      description:
        'We block these IPs from withdrawing funds. Please be careful.',
      color: '$red',
      default_item_archivation_time: 2592000,
      primary_field: 'device.fingerprint',
      secondary_field: 'ip.value',
    };

    const expected = {
      requestUrl: new URL(`https://castle.io/v1/lists`),
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
      const received = CommandCreateListService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
