import { RiskPolicy } from './risk-policy';
import { Verdict } from './verdict';

export type AuthenticateResult = {
  action: Verdict;
  user_id?: string;
  user?: { email?: string; username?: string };
  device_token?: string;
  failover?: boolean;
  failover_reason?: string;
  risk_policy?: RiskPolicy;
};
