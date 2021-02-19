import { Configuration } from '../../configuraton';
import { AuthenticateResult } from '../../models';
import { CoreProcessResponseService } from '../../core/core.module';
import { LoggerService } from '../../logger/logger.module';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';

export const APIService = {
  call: async (
    controller: AbortController,
    { requestUrl, requestOptions },
    configuration: Configuration
  ): Promise<any> => {
    const fetcher = configuration.overrideFetch || fetch;

    let response: Response;
    const timeout = setTimeout(() => {
      controller.abort();
    }, configuration.timeout);

    try {
      response = await fetcher(requestUrl, requestOptions);
    } catch (err) {
      LoggerService.call(
        { requestUrl, requestOptions, err },
        configuration.logger
      );
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    const processedResponse = await CoreProcessResponseService.call(
      requestUrl,
      requestOptions,
      response,
      configuration.logger
    );

    return processedResponse;
  },
};
