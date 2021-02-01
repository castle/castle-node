import { Configuration } from '../src/configuraton';
import { ConfigurationError } from '../src/errors';
import { FailoverStrategy } from '../src/failover/models/failover-strategy';

describe('Configration', () => {
  describe('initialization', () => {
    let config;

    describe('timeout', () => {
      config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default timeout', () => {
        expect(config.timeout).toEqual(1000);
      });

      describe('with setter', () => {
        config = new Configuration({
          apiSecret: 'test',
          timeout: 2000,
        });

        it('sets correct timeout', () => {
          expect(config.timeout).toEqual(2000);
        });
      });
    });

    describe('allowlisted', () => {
      config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default allowlist', () => {
        expect(config.allowlisted).toEqual([]);
      });

      describe('with setter', () => {
        config = new Configuration({
          apiSecret: 'test',
          allowlisted: ['header'],
        });

        it('sets correct allowlist', () => {
          expect(config.allowlisted).toEqual(['header']);
        });
      });
    });

    describe('denylisted', () => {
      config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default denylist', () => {
        expect(config.denylisted).toEqual([]);
      });

      describe('with setter', () => {
        config = new Configuration({
          apiSecret: 'test',
          denylisted: ['header'],
        });

        it('sets correct denylist', () => {
          expect(config.denylisted).toEqual(['header']);
        });
      });
    });

    describe('failoverStrategy', () => {
      config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default failoverStrategy', () => {
        expect(config.failoverStrategy).toEqual(FailoverStrategy.allow);
      });

      describe('with setter', () => {
        config = new Configuration({
          apiSecret: 'test',
          failoverStrategy: FailoverStrategy.challenge,
        });

        it('sets correct failoverStrategy', () => {
          expect(config.failoverStrategy).toEqual(FailoverStrategy.challenge);
        });
      });
    });

    describe('apiSecret', () => {
      config = new Configuration({
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
