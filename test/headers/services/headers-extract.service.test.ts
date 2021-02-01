import { HeadersExtractService } from '../../../src/headers/headers.module';
import { Configuration } from '../../../src/configuraton';

describe('HeadersExtractService', () => {
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

      const config = new Configuration({
        apiSecret: 'test',
        allowlisted: [],
        denylisted: [],
      });

      it('scrubs authorization and cookie headers', () => {
        expect(HeadersExtractService.call(formattedHeaders, config)).toEqual(
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

      const config = new Configuration({
        apiSecret: 'test',
        allowlisted: ['accept', 'ok'],
        denylisted: [],
      });

      it('scrubs authorization and cookie headers', () => {
        expect(HeadersExtractService.call(formattedHeaders, config)).toEqual(
          result
        );
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

        const config = new Configuration({
          apiSecret: 'test',
          allowlisted: [],
          denylisted: ['user-agent'],
        });

        it('scrubs authorization and cookie headers', () => {
          expect(HeadersExtractService.call(formattedHeaders, config)).toEqual(
            result
          );
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

        const config = new Configuration({
          apiSecret: 'test',
          allowlisted: [],
          denylisted: ['accept'],
        });

        it('scrubs authorization and cookie headers', () => {
          expect(HeadersExtractService.call(formattedHeaders, config)).toEqual(
            result
          );
        });
      });
    });

    describe('when a header is both allowlisted and denylisted', () => {
      const result = {
        accept: true,
      };

      const config = new Configuration({
        apiSecret: 'test',
        allowlisted: ['accept'],
        denylisted: ['accept'],
      });

      it('scrubs authorization and cookie headers', () => {
        expect(
          HeadersExtractService.call({ accept: 'application/json' }, config)
        ).toEqual(result);
      });
    });
  });
});
