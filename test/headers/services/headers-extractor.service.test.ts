import { HeadersExtractorService } from '../../../src/headers/headers.module';

describe('HeadersExtractorService', () => {
  describe('call', () => {
    const formattedHeaders = {
      'content-length': '0',
      authorization: 'Basic 123456',
      cookie: '__cid=abcd;other=efgh',
      ok: 'OK',
      accept: 'application/json',
      'x-forwarded-for': '1.2.3.4',
      'user-agent': 'Mozilla 1234',
    };

    describe('when allowlist is not set in the configuration', () => {
      const result = {
        accept: 'application/json',
        authorization: true,
        cookie: true,
        'content-length': '0',
        ok: 'OK',
        'user-agent': 'Mozilla 1234',
        'x-forwarded-for': '1.2.3.4',
      };

      it('scrubs authorization and cookie headers', () => {
        expect(HeadersExtractorService.call(formattedHeaders, [], [])).toEqual(
          result
        );
      });
    });

    describe('when allowlist is set in the configuration', () => {
      const result = {
        accept: 'application/json',
        authorization: true,
        cookie: true,
        'content-length': true,
        ok: 'OK',
        'user-agent': 'Mozilla 1234',
        'x-forwarded-for': true,
      };

      it('scrubs authorization and cookie headers', () => {
        expect(
          HeadersExtractorService.call(formattedHeaders, ['accept', 'ok'], [])
        ).toEqual(result);
      });
    });

    describe('when denylist is set in the configuration', () => {
      describe('with a User-Agent', () => {
        const result = {
          accept: 'application/json',
          authorization: true,
          cookie: true,
          'content-length': '0',
          ok: 'OK',
          'user-agent': 'Mozilla 1234',
          'x-forwarded-for': '1.2.3.4',
        };

        it('scrubs authorization and cookie headers', () => {
          expect(
            HeadersExtractorService.call(formattedHeaders, [], ['user-agent'])
          ).toEqual(result);
        });
      });

      describe('with a different header', () => {
        const result = {
          accept: true,
          authorization: true,
          cookie: true,
          'content-length': '0',
          ok: 'OK',
          'user-agent': 'Mozilla 1234',
          'x-forwarded-for': '1.2.3.4',
        };

        it('scrubs authorization and cookie headers', () => {
          expect(
            HeadersExtractorService.call(formattedHeaders, [], ['accept'])
          ).toEqual(result);
        });
      });
    });

    describe('when a header is both allowlisted and denylisted', () => {
      const result = {
        accept: true,
      };

      it('scrubs authorization and cookie headers', () => {
        expect(
          HeadersExtractorService.call(
            { accept: 'application/json' },
            ['accept'],
            ['accept']
          )
        ).toEqual(result);
      });
    });
  });
});
