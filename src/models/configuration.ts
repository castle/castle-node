import pino from 'pino';
import { FailoverStrategy } from '../failover/models/failover-strategy';

export type Configuration = {
  apiSecret: string;
  apiUrl?: string;
  timeout?: number;
  allowlisted?: string[];
  denylisted?: string[];
  overrideFetch?: any;
  failoverStrategy?: FailoverStrategy;
  logLevel?: pino.Level;
  doNotTrack?: boolean;
};
