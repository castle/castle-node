import { IPsExtractService } from '../../../src/ips/ips.module';

describe('IPsExtractService', () => {
  describe('call', () => {
    describe('when regular IPs', () => {
      const headers = {
        'x-forwarded-for': '1.2.3.5',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [],
      };

      it('extracts correct IPs', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('1.2.3.5');
      });
    });

    describe('when we need to use other IP header', () => {
      const headers = {
        'cf-connecting-ip': '1.2.3.4',
        'x-forwarded-for': '1.1.1.1, 1.2.2.2, 1.2.3.5',
      };

      describe('regular format', () => {
        const config = {
          apiSecret: 'test',
          ipHeaders: ['cf-connecting-ip', 'x-forwarded-for'],
          trustedProxies: [],
        };

        it('extracts correct IPs', () => {
          expect(IPsExtractService.call(headers, config)).toEqual('1.2.3.4');
        });
      });

      describe('with value from trusted proxies it get seconds header', () => {
        const config = {
          apiSecret: 'test',
          ipHeaders: ['cf-connecting-ip', 'x-forwarded-for'],
          trustedProxies: [new RegExp('1.2.3.4')],
        };

        it('extracts correct IPs', () => {
          expect(IPsExtractService.call(headers, config)).toEqual('1.2.3.5');
        });
      });
    });

    describe('when all the trusted proxies', () => {
      const headers = {
        'x-forwarded-for': '127.0.0.1,10.0.0.1,172.31.0.1,192.168.0.1',
        'remote-addr': '127.0.0.1',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [],
      };

      it('fallbacks to first available header when all headers are marked trusted proxy', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('127.0.0.1');
      });
    });

    describe('when trustProxyChain option', () => {
      const headers = {
        'x-forwarded-for': '6.6.6.6, 2.2.2.3, 6.6.6.5',
        'remote-addr': '6.6.6.4',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [],
        trustProxyChain: true,
      };

      it('selects first available header', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('6.6.6.6');
      });
    });

    describe('when trustedProxyDepth option', () => {
      const headers = {
        'x-forwarded-for': '6.6.6.6, 2.2.2.3, 6.6.6.5',
        'remote-addr': '6.6.6.4',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [],
        trustedProxyDepth: 1,
      };

      it('selects first available header', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('2.2.2.3');
      });
    });

    describe('when list of not trusted IPs provided in x-forwarded-for', () => {
      const headers = {
        'x-forwarded-for': '6.6.6.6, 2.2.2.3, 192.168.0.7',
        'client-ip': '6.6.6.6',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [],
      };

      it('does not allow to spoof IP', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('2.2.2.3');
      });
    });

    describe('when marked 2.2.2.3 as trusted proxy', () => {
      const headers = {
        'x-forwarded-for': '6.6.6.6, 2.2.2.3, 192.168.0.7',
        'client-ip': '6.6.6.6',
      };

      const config = {
        apiSecret: 'test',
        ipHeaders: [],
        trustedProxies: [new RegExp(/^2.2.2.\d$/)],
      };

      it('does not allow to spoof IP', () => {
        expect(IPsExtractService.call(headers, config)).toEqual('6.6.6.6');
      });
    });
  });
});
