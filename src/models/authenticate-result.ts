import { RiskPolicy } from './risk-policy';
import { Verdict } from './verdict';
import { Signals } from './signals';

export type AuthenticateResult = {
  action: Verdict | string;
  risk?: number;
  user_id?: string;
  user?: { email?: string; username?: string };
  device_token?: string;
  failover?: boolean;
  failover_reason?: string;
  policy?: RiskPolicy;
  signals?: Signals;
  internal?: string;
};
