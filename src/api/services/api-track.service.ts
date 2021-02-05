import { Configuration } from '../../configuraton';
import { AuthenticateResult, Payload } from '../../models';
import { CommandTrackService } from '../../command/command.module';
import { CoreProcessResponseService } from '../../core/core.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { LoggerService } from '../../logger/logger.module';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import pino from 'pino';

const isTimeout = (e: Error) => e.name === 'AbortError';

export const APITrackService = {
  call: async (
    params: Payload,
    configuration: Configuration,
    logger: pino.Logger
  ): Promise<void> => {
    const fetcher = configuration.overrideFetch || fetch;

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, configuration.timeout);
    const { requestUrl, requestOptions } = CommandTrackService.call(
      controller,
      params,
      configuration
    );

    try {
      response = await fetcher(requestUrl, requestOptions);
    } catch (err) {
      if (isTimeout(err)) {
        return LoggerService.call({ requestUrl, requestOptions, err }, logger);
      }
    } finally {
      clearTimeout(timeout);
    }

    CoreProcessResponseService.call(
      requestUrl,
      requestOptions,
      response,
      logger
    );
  },
};
