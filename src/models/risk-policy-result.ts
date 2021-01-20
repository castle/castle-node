import { RiskPolicy } from './risk-policy';

export type RiskPolicyResult = {
  id: string;
  revision_id: string;
  name: string;
  type: RiskPolicy;
};
