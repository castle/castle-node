import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UserUnauthorizedError,
  InvalidParametersError,
  InvalidRequestTokenError,
  InternalServerError,
  APIError,
  RateLimitError,
} from '../../errors';
import { LoggerService } from '../../logger/logger.module';

const RESPONSE_ERRORS = {
  '400': BadRequestError,
  '401': UnauthorizedError,
  '403': ForbiddenError,
  '404': NotFoundError,
  '419': UserUnauthorizedError,
  '422': InvalidParametersError,
  '429': RateLimitError,
};

const RESPONSE_SUB_ERRORS = {
  invalid_request_token: InvalidRequestTokenError,
};

// The body on the request is a stream and can only be
// read once, by default. This is a workaround so that the
// logging functions can read the body independently
// of the handlers.
const getBody = async (response: any) => {
  if (response.cachedBody) {
    return response.cachedBody;
  }

  try {
    const preparsedResponse = await response.text();
    if (preparsedResponse) {
      response.cachedBody = await JSON.parse(preparsedResponse);
    } else {
      response.cachedBody = {};
    }
  } catch (e) {
    throw new APIError('Castle: Malformed JSON response');
  }

  return response.cachedBody;
};

export const CoreProcessResponseService = {
  call: async (requestUrl, requestOptions, response, logger) => {
    const body = await getBody(response);

    LoggerService.call({ requestUrl, requestOptions, response, body }, logger);

    if (response.status >= 200 && response.status <= 299) {
      return body;
    }

    if (response.status >= 500 && response.status <= 599) {
      throw new InternalServerError(
        `Castle: Responded with ${response.status} code`
      );
    }

    // Throw a special exception for subtype errors if defined. Eg. for
    // invalid request token, which is a subtype of InvalidParametersError.
    // Otherwise, throw exception as defined per status code or a general
    // API error
    const err =
      RESPONSE_SUB_ERRORS[body.type] ||
      RESPONSE_ERRORS[response.status.toString()] ||
      APIError;

    throw new err(`Castle: Responded with ${response.status} code`);
  },
};
