import { Configuration } from '../../configuraton';
import { AuthenticateResult } from '../../models';
import { CoreProcessResponseService } from '../../core/core.module';
import { LoggerService } from '../../logger/logger.module';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import pino from 'pino';

const isTimeout = (e: Error) => e.name === 'AbortError';
export const APIService = {
  call: async (
    controller: AbortController,
    { requestUrl, requestOptions },
    configuration: Configuration,
    logger: pino.Logger
  ): Promise<void | AuthenticateResult> => {
    const fetcher = configuration.overrideFetch || fetch;

    let response: Response;
    const timeout = setTimeout(() => {
      controller.abort();
    }, configuration.timeout);

    try {
      response = await fetcher(requestUrl, requestOptions);
    } catch (err) {
      if (isTimeout(err)) {
        return LoggerService.call({ requestUrl, requestOptions, err }, logger);
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
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
