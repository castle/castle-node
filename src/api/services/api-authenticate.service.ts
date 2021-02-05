import { Configuration } from '../../configuraton';
import { AuthenticateResult, Payload } from '../../models';
import { CommandAuthenticateService } from '../../command/command.module';
import { CoreProcessResponseService } from '../../core/core.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { LoggerService } from '../../logger/logger.module';
import fetch from 'node-fetch';
import pino from 'pino';

const isTimeout = (e: Error) => e.name === 'AbortError';

const handleFailover = (
  userId: string,
  reason: string,
  configuration: Configuration,
  err?: Error
): AuthenticateResult => {
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

export const APIAuthenticateService = {
  call: async (
    params: Payload,
    configuration: Configuration,
    logger: pino.Logger
  ): Promise<AuthenticateResult> => {
    const fetcher = configuration.overrideFetch || fetch;

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, configuration.timeout);
    const { requestUrl, requestOptions } = CommandAuthenticateService.call(
      controller,
      params,
      configuration
    );

    try {
      response = await fetcher(requestUrl, requestOptions);
    } catch (err) {
      LoggerService.call({ requestUrl, requestOptions, err }, logger);

      if (isTimeout(err)) {
        return handleFailover(params.user_id, 'timeout', configuration, err);
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
    }

    if (response.status >= 500) {
      return handleFailover(params.user_id, 'server error', configuration);
    }

    const processedResponse = await CoreProcessResponseService.call(
      requestUrl,
      requestOptions,
      response,
      logger
    );

    return processedResponse;
  },
};
