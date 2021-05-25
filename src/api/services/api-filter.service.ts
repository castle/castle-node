import { Configuration } from '../../configuraton';
import { InternalServerError } from '../../errors';
import { FilterResult } from '../../models';
import { CommandFilterService } from '../../command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { FilterPayload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

const handleFailover = (
  userId: string,
  reason: string,
  configuration: Configuration,
  err?: Error
): FilterResult => {
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

export const APIFilterService = {
  call: async (
    options: FilterPayload,
    configuration: Configuration
  ): Promise<FilterResult> => {
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
