import { AuthenticateResult } from '../../models';
import { FailoverStrategy } from '../models';

export const FailoverResponsePreparerService = {
  call: (
    user_id: string,
    reason: string,
    strategy: FailoverStrategy
  ): AuthenticateResult => {
    return {
      action:
        // This is just for the type system, asurring it that failOverStrategy
        // can not be 'none'.
        strategy === 'none' ? 'allow' : strategy,
      user_id,
      failover: true,
      failover_reason: reason,
    };
  },
};
