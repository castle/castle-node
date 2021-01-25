import { CommandGenerateService } from '../../../src/command/command.module';
import { version } from '../../../package.json';

describe('CommandGenerateService', () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2021-01-25T00:00:00.000Z').valueOf()
      );
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
        body: {
          sent_at: '2021-01-25T00:00:00.000Z',
          context: JSON.stringify({
            client_id: 'client_id',
            headers: {},
            library: {
              name: 'castle-node',
              version,
            },
          }),
        },
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
      const received = CommandGenerateService.call(
        controller,
        'test',
        { context },
        'GET',
        config
      );
      console.log(expected, received);
    });
  });
});
