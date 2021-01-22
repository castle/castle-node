import { AuthenticateResult, Verdict } from '../../models';

export const FailoverResponsePreparerService = {
  call: (
    user_id: string,
    reason: string,
    strategy: Verdict
  ): AuthenticateResult => {
    return {
      action: strategy,
      user_id,
      failover: true,
      failover_reason: reason,
    };
  },
};
