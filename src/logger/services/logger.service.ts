import { LoggingParameters } from '../models';
import { LoggerRequestFormatterService } from '../services';

export const LoggerService = {
  call: async (
    { requestUrl, requestOptions, response, body, err }: LoggingParameters,
    logger: any
  ) => {
    return logger.info(
      LoggerRequestFormatterService.call({
        requestUrl,
        requestOptions,
        response,
        err,
        body,
      })
    );
  },
};
