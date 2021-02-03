import { ClientIdExtractService } from '../../../src/client-id/client-id.module';

describe('ClientIdExtractService', () => {
  describe('call', () => {
    const expectedFromCookie = 'abcd';
    const expectedFromHeader = 'abcde';

    describe('with client_id', () => {
      it('extracts client_id from cookie', () => {
        const headers = {
          cookie: '__cid=abcd;other=efgh',
          'x-forwarded-for': '1.2.3.4',
        };
        const received = ClientIdExtractService.call(headers, headers.cookie);
        expect(received).toEqual(expectedFromCookie);
      });
    });

    describe('with x-castle-client-id header', () => {
      it('extracts client_id from cookie', () => {
        const headers = {
          cookie: '',
          'x-forwarded-for': '1.2.3.4',
          'x-castle-client-id': expectedFromHeader,
        };
        const received = ClientIdExtractService.call(headers, headers.cookie);
        expect(received).toEqual(expectedFromHeader);
      });
    });

    describe('with cookies and headers undefined', () => {
      it('returns empty string', () => {
        const headers = {
          cookie: '',
        };
        const received = ClientIdExtractService.call(headers, headers.cookie);
        expect(received).toEqual('');
      });
    });

    describe('with headers and cookie defined', () => {
      it('extracts client_id from headers', () => {
        const headers = {
          cookie: '__cid=abcd;other=efgh',
          'x-forwarded-for': '1.2.3.4',
          'x-castle-client-id': expectedFromHeader,
        };
        const received = ClientIdExtractService.call(headers, headers.cookie);
        expect(received).toEqual(expectedFromHeader);
      });
    });
  });
});
