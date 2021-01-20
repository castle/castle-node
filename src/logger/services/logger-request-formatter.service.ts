import { LoggingParameters } from '../models';
import {
  LoggerResponseFormatterService,
  LoggerErrorFormatterService,
} from '../services';

export const LoggerRequestFormatterService = {
  call: ({
    requestUrl,
    requestOptions,
    response,
    err,
    body,
  }: LoggingParameters) => `
-- Castle request
URL: ${requestUrl}
Request: ${JSON.stringify(requestOptions)}
-- Castle response
${
  response
    ? LoggerResponseFormatterService.call(response, body)
    : LoggerErrorFormatterService.call(err)
}
`,
};
