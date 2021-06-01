import { Configuration } from '../../configuraton';
import { InternalServerError } from '../../errors';
import { CommandRiskService } from '../../command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

const handleFailover = (
  userId: string,
  reason: string,
  configuration: Configuration,
  err?: Error
): object => {
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
    options: any,
    configuration: Configuration
  ): Promise<object> => {
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
