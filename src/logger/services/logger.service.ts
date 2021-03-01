import { LoggingParameters } from '../models';
import { LoggerRequestFormatterService } from '../services';

export const LoggerService = {
  call: async (
    { requestUrl, requestOptions, response, body, err }: LoggingParameters,
    logger: any
  ) => {
    if (err) {
      return logger.error(
        LoggerRequestFormatterService.call({ requestUrl, requestOptions, err })
      );
    }

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
