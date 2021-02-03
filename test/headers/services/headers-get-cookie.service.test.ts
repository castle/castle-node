import { HeadersGetCookieService } from '../../../src/headers/headers.module';

describe('HeadersGetCookieService', () => {
  describe('call', () => {
    it('doesnt get cookie from empty header', () => {
      const headers = {
        cookie: '',
      };

      expect(
        HeadersGetCookieService.call(headers.cookie, '_key')
      ).toBeUndefined();
    });

    it('gets cookie with encoded value', () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=\u002C\u003B; a_key=f195d29f3ee38e07bd95ae9c',
      };

      expect(HeadersGetCookieService.call(headers.cookie, 'cf')).toEqual(',');
    });

    it('gets cookie from the end', () => {
      const headers = {
        cookie: '__uid=21917; cfids187=; _key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '_key')).toEqual(
        'f195d29f3ee38e07bd95ae9c'
      );
    });

    it('gets cookie from the middle', () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, 'cf')).toEqual('abc');
    });

    it('gets cookie from the start', () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '__uid')).toEqual(
        '21917'
      );
    });

    it('does not get cookie with similar prefix', () => {
      const headers = {
        cookie: '__uid=21917; cfids187=; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(
        HeadersGetCookieService.call(headers.cookie, '_key')
      ).toBeUndefined();
    });

    it('doesnt get cookie from the middle when empty', () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, 'cfids187')).toEqual(
        ''
      );
    });
  });
});
