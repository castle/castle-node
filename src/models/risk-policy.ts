export interface RiskPolicy {
  id: string;
  revision_id: string;
  name: string;
  action: string | null | undefined;
}

export interface RiskPolicyFailover {
  action: string | null | undefined;
}
