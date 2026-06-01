import { CommandSearchEventsService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import MockDate from 'mockdate';
import {
  SearchEventsQueryFilterOperator,
  SearchEventsQueryType,
} from '../../../src/payload/models';

describe('CommandSearchEvents', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const options = {
      filters: [
        {
          field: 'user.email',
          op: '$eq' as SearchEventsQueryFilterOperator,
          value: 'user@example.org',
        },
      ],
      query_type: '$records_with_count' as SearchEventsQueryType,
      page: 1,
      results_size: 1,
    };

    const expected = {
      requestUrl: new URL(`https://castle.io/v1/events/query`),
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
      const received = CommandSearchEventsService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });
  });
});
