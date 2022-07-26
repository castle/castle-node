import { RiskPolicy, RiskPolicyFailover } from './risk-policy';
import { Verdict } from './verdict';
import { Signals } from './signals';

export interface AuthenticateResult {
  action: Verdict | string;
  risk?: number;
  user_id?: string;
  user?: { email?: string; username?: string };
  device_token?: string;
  failover?: boolean;
  failover_reason?: string;
  policy?: RiskPolicy | RiskPolicyFailover;
  signals?: Signals;
  internal?: string;
}
