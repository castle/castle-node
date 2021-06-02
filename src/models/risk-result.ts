import type { RiskPolicy } from './risk-policy';
import type { Verdict } from './verdict';
import type { Signals } from './signals';
import type { Device } from './device';

export type RiskResult = {
  action: Verdict | string;
  risk?: number;
  failover?: boolean;
  failover_reason?: string;
  policy?: RiskPolicy;
  signals?: Signals;
  device?: Device;
};
