import { CommandTrackService } from '../../../src/command/command.module';
import { version } from '../../../package.json';
import MockDate from 'mockdate';

describe('CommandTrackService', () => {
  beforeEach(() => {
    MockDate.set(new Date('2021-01-25T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('call', () => {
    const controller = new AbortController();
    const expected = {
      requestUrl: 'castle.io/track',
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

    const config = {
      apiSecret: 'test',
      apiUrl: 'castle.io',
    };

    const context = {
      client_id: 'client_id',
    };

    it('generates payload', () => {
      const received = CommandTrackService.call(
        controller,
        { context },
        config
      );
      expect(received).toMatchObject(expected);
    });
  });
});
