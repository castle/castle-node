import { Configuration } from '../../configuraton';
import { InternalServerError } from '../../errors';
import { RiskResult } from '../../models';
import { CommandRiskService } from '../../command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { RiskPayload } from '../../payload/risk_payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

const handleFailover = (
  userId: string,
  reason: string,
  configuration: Configuration,
  err?: Error
): RiskResult => {
  // Have to check it this way to make sure TS understands
  // that this.failoverStrategy is of type Verdict,
  // not FailoverStrategyType.
  if (configuration.failoverStrategy === FailoverStrategy.throw) {
    throw err;
  }

  return FailoverResponsePrepareService.call(
    userId,
    reason,
    configuration.failoverStrategy
  );
};

const isTimeoutError = (e: Error) => e.name === 'AbortError';

export const APIRiskService = {
  call: async (
    options: RiskPayload,
    configuration: Configuration
  ): Promise<RiskResult> => {
    const controller = new AbortController();
    const command = CommandRiskService.call(
      controller,
      options,
      configuration
    );

    let processedResponse;
    try {
      processedResponse = await APIService.call(
        controller,
        command,
        configuration
      );
    } catch (e) {
      if (isTimeoutError(e)) {
        return handleFailover(options.user.id, 'timeout', configuration, e);
      } else if (e instanceof InternalServerError) {
        return handleFailover(options.user.id, 'server error', configuration);
      } else {
        throw e;
      }
    }

    return processedResponse;
  },
};
