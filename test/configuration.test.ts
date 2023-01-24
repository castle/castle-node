import { Configuration } from '../src/configuration';
import { ConfigurationError } from '../src/errors';
import { FailoverStrategy } from '../src/failover/models/failover-strategy';

describe('Configration', () => {
  describe('initialization', () => {
    describe('timeout', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default timeout', () => {
        expect(config.timeout).toEqual(1500);
      });

      describe('with setter', () => {
        const cfg = new Configuration({
          apiSecret: 'test',
          timeout: 2000,
        });

        it('sets correct timeout', () => {
          expect(cfg.timeout).toEqual(2000);
        });
      });
    });

    describe('allowlisted', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default allowlist', () => {
        expect(config.allowlisted).toEqual([]);
      });

      describe('with setter', () => {
        const cfg = new Configuration({
          apiSecret: 'test',
          allowlisted: ['header'],
        });

        it('sets correct allowlist', () => {
          expect(cfg.allowlisted).toEqual(['header']);
        });
      });
    });

    describe('denylisted', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default denylist', () => {
        expect(config.denylisted).toEqual([]);
      });

      describe('with setter', () => {
        const cfg = new Configuration({
          apiSecret: 'test',
          denylisted: ['header'],
        });

        it('sets correct denylist', () => {
          expect(cfg.denylisted).toEqual(['header']);
        });
      });
    });

    describe('failoverStrategy', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default failoverStrategy', () => {
        expect(config.failoverStrategy).toEqual(FailoverStrategy.allow);
      });

      describe('with setter', () => {
        const cfg = new Configuration({
          apiSecret: 'test',
          failoverStrategy: FailoverStrategy.challenge,
        });

        it('sets correct failoverStrategy', () => {
          expect(cfg.failoverStrategy).toEqual(FailoverStrategy.challenge);
        });
      });
    });

    describe('apiSecret', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets correct apiSecret', () => {
        expect(config.apiSecret).toEqual('test');
      });

      describe('config without apiSecret', () => {
        it('raises error', () => {
          expect(() => new Configuration({ apiSecret: '' })).toThrow(
            ConfigurationError
          );
        });
      });
    });
  });
});
