import { CommandRiskService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';
import MockDate from 'mockdate';

describe('CommandRiskService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: new URL('https://castle.io/risk'),
      requestOptions: {
        signal: controller.signal,
        method: 'POST',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sent_at: '2021-01-25T00:00:00.000Z',
          context: {
            ip: '127.0.0.1',
            headers: {
              'x-castle-client-id': 'client_id',
            },
            client_id: 'client_id',
            active: true,
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
      baseUrl: 'https://castle.io',
    });

    const context = {
      ip: '127.0.0.1',
      headers: {
        'x-castle-client-id': 'client_id',
      },
    };

    it('generates payload', () => {
      const received = CommandRiskService.call(controller, { context }, config);
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
