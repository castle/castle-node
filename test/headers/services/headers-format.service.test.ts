import { HeadersFormatService } from '../../../src/headers/headers.module';

describe('HeadersFormatService', () => {
  describe('call', () => {
    it('removes HTTP_', () => {
      expect(HeadersFormatService.call('HTTP_X_TEST')).toEqual('x-test');
    });

    it('makes header lowercase', () => {
      expect(HeadersFormatService.call('X_TEST')).toEqual('x-test');
    });

    it('ignores letter case and -_ dividers', () => {
      expect(HeadersFormatService.call('http-X_teST')).toEqual('x-test');
    });

    it('does not remove http if there is no _- char', () => {
      expect(HeadersFormatService.call('httpX_teST')).toEqual('httpx-test');
    });
  });
});
