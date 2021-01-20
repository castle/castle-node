import pino from 'pino';
import { FailoverStrategy } from './failover-strategy';

export type Configuration = {
  apiSecret: string;
  apiUrl?: string;
  timeout?: number;
  allowedHeaders?: string[];
  disallowedHeaders?: string[];
  overrideFetch?: any;
  failoverStrategy?: FailoverStrategy;
  logLevel?: pino.Level;
  doNotTrack?: boolean;
};
