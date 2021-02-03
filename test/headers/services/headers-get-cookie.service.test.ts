import { HeadersGetCookieService } from '../../../src/headers/headers.module';

describe('HeadersGetCookieService', () => {
  describe('call', () => {
    it('doesnt get cookie from empty header', async () => {
      const headers = {
        cookie: '',
      };

      expect(HeadersGetCookieService.call(headers.cookie, '_key'))
        .toBeUndefined;
    });

    it('gets cookie with encoded value', async () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=\u002C\u003B; a_key=f195d29f3ee38e07bd95ae9c',
      };

      expect(HeadersGetCookieService.call(headers.cookie, 'cf')).toEqual(',');
    });

    it('gets cookie from the end', async () => {
      const headers = {
        cookie: '__uid=21917; cfids187=; _key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '_key')).toEqual(
        'f195d29f3ee38e07bd95ae9c'
      );
    });

    it('gets cookie from the middle', async () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, 'cf')).toEqual('abc');
    });

    it('gets cookie from the start', async () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '__uid')).toEqual(
        '21917'
      );
    });

    it('gets cookie with similar prefix', async () => {
      const headers = {
        cookie: '__uid=21917; cfids187=; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '_key'))
        .toBeUndefined;
    });

    it('doesnt get cookie from the middle when empty', async () => {
      const headers = {
        cookie:
          '__uid=21917; cfids187=; cf=abc; a_key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, 'cfids187'))
        .toBeUndefined;
    });

    it('doesnt get cookie with different header', async () => {
      const headers = {
        cookie: '__uid=21917; cfids187=; _key=f195d29f3ee38e07bd95ae9c',
      };
      expect(HeadersGetCookieService.call(headers.cookie, '_key'))
        .toBeUndefined;
    });
  });
});
