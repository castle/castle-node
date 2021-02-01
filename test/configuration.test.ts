import { Configuration } from '../src/configuraton';
import { FailoverStrategy } from '../src/failover/models/failover-strategy';

describe('Configration', () => {
  describe('initialization', () => {
    describe('timeout', () => {
      const config = new Configuration({
        apiSecret: 'test',
      });

      it('sets default timeout', () => {
        expect(config.timeout).toEqual(1000);
      });

      describe('with setter', () => {
        const config = new Configuration({
          apiSecret: 'test',
          timeout: 2000,
        });

        it('sets correct timeout', () => {
          expect(config.timeout).toEqual(2000);
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
        const config = new Configuration({
          apiSecret: 'test',
          allowlisted: ['header'],
        });

        it('sets correct allowlist', () => {
          expect(config.allowlisted).toEqual(['header']);
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
        const config = new Configuration({
          apiSecret: 'test',
          denylisted: ['header'],
        });

        it('sets correct denylist', () => {
          expect(config.denylisted).toEqual(['header']);
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
        const config = new Configuration({
          apiSecret: 'test',
          failoverStrategy: FailoverStrategy.challenge,
        });

        it('sets correct failoverStrategy', () => {
          expect(config.failoverStrategy).toEqual(FailoverStrategy.challenge);
        });
      });
    });
  });
});
