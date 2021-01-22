import { AuthenticateResult, Verdict } from '../../models';

export const FailoverResponsePrepareService = {
  call: (
    user_id: string,
    reason: string,
    strategy: Verdict | string
  ): AuthenticateResult => {
    return {
      action: strategy,
      user_id,
      failover: true,
      failover_reason: reason,
    };
  },
};
