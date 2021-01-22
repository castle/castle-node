import { AuthenticateResult, Verdict } from '../../models';

export const FailoverResponsePrepareService = {
  call: (
    userId: string,
    reason: string,
    strategy: Verdict | string
  ): AuthenticateResult => {
    return {
      action: strategy,
      user_id: userId,
      failover: true,
      failover_reason: reason,
    };
  },
};
