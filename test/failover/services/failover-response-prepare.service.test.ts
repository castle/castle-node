import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../../src/failover/failover.module';

describe('FailoverResponsePrepareService', () => {
  describe('call', () => {
    const userId = 'user_id';
    const reason = 'timeout';
    const strategy = FailoverStrategy.deny;

    const expected = {
      action: strategy,
      user_id: userId,
      failover: true,
      failover_reason: reason,
    };

    it('generates failover response', () => {
      const received = FailoverResponsePrepareService.call(
        userId,
        reason,
        strategy
      );
      expect(received).toMatchObject(expected);
    });
  });
});
