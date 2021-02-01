import { CommandGenerateService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuraton';
import { version } from '../../../package.json';
import MockDate from 'mockdate';

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
      requestUrl: 'castle.io/test',
      requestOptions: {
        signal: controller.signal,
        method: 'GET',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sent_at: '2021-01-25T00:00:00.000Z',
          context: {
            client_id: 'client_id',
            headers: {},
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
      baseUrl: 'castle.io',
    });

    const context = {
      client_id: 'client_id',
    };

    it('generates payload', () => {
      const received = CommandGenerateService.call(
        controller,
        'test',
        { context },
        'GET',
        config
      );
      expect(received).toMatchObject(expected);
    });
  });
});
