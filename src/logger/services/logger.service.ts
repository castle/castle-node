import { LoggingParameters } from '../models';
import { LoggerRequestFormatterService } from '../services';
import pino from 'pino';

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

    let log: pino.LogFn;

    if (response.ok) {
      log = logger.info.bind(logger);
    } else if (response.status < 500 && response.status >= 400) {
      log = logger.warn.bind(logger);
    } else {
      log = logger.error.bind(logger);
    }

    return log(
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
