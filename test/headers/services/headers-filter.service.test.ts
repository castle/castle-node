import { HeadersFilterService } from '../../../src/headers/headers.module';

describe('HeadersFilterService', () => {
  describe('call', () => {
    const headers = {
      HTTP_AUTHORIZATION: 'Basic 123456',
      HTTP_COOKIE: '__cid=abcd;other=efgh',
      HTTP_ACCEPT: 'application/json',
      HTTP_X_FORWARDED_FOR: '1.2.3.4',
      HTTP_USER_AGENT: 'Mozilla 1234',
      TEST: '1',
      REMOTE_ADDR: '1.2.3.4',
    };

    const result = {
      accept: 'application/json',
      authorization: 'Basic 123456',
      cookie: '__cid=abcd;other=efgh',
      'user-agent': 'Mozilla 1234',
      'remote-addr': '1.2.3.4',
      'x-forwarded-for': '1.2.3.4',
    };

    it('filters headers', () => {
      expect(HeadersFilterService.call(headers)).toMatchObject(result);
    });
  });
});
