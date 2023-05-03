import { RiskPolicy, RiskPolicyFailover } from './risk-policy';
import { EventAction } from './events';
import { Signals } from './signals';

export interface AuthenticateResult {
  action: EventAction | string;
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
