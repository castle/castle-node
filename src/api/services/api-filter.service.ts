import { Configuration } from '../../configuration';
import { InternalServerError } from '../../errors';
import { CommandFilterService } from '../../command/command.module';
import { FailoverStrategy } from '../../failover/failover.module';
import type { FilterPayload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

const handleFailover = (
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
  return {
    policy: {
      action: configuration.failoverStrategy,
    },
    action: configuration.failoverStrategy,
    failover: true,
    failover_reason: reason,
  };
};

const isTimeoutError = (e: Error) => e.name === 'AbortError';

export const APIFilterService = {
  call: async (
    options: FilterPayload,
    configuration: Configuration
  ): Promise<object> => {
    const controller = new AbortController();
    const command = CommandFilterService.call(
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
        return handleFailover('timeout', configuration, e);
      } else if (e instanceof InternalServerError) {
        return handleFailover('server error', configuration, e);
      } else {
        throw e;
      }
    }

    return processedResponse;
  },
};
