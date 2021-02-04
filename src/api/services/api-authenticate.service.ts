import { Configuration } from '../../configuraton';
import { AuthenticateResult, Payload } from '../../models';
import {
  CommandAuthenticateService,
} from '../../command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from '../../failover/failover.module';
import { LoggerService } from '../../logger/logger.module';
import fetch from 'node-fetch';
import pino from 'pino';

// The body on the request is a stream and can only be
// read once, by default. This is a workaround so that the
// logging functions can read the body independently
// of the handlers.
const getBody = async (response: any) => {
  if (response.cachedBody) {
    return response.cachedBody;
  }

  try {
    response.cachedBody = await response.json();
  } catch (e) {
    response.cachedBody = {};
  }

  return response.cachedBody;
};

const isTimeout = (e: Error) => e.name === 'AbortError';

  // private handleFailover(
  //   userId: string,
  //   reason: string,
  //   err?: Error
  // ): AuthenticateResult {
  //   // Have to check it this way to make sure TS understands
  //   // that this.failoverStrategy is of type Verdict,
  //   // not FailoverStrategyType.
  //   if (this.configuration.failoverStrategy === FailoverStrategy.throw) {
  //     throw err;
  //   }

  //   return FailoverResponsePrepareService.call(
  //     userId,
  //     reason,
  //     this.configuration.failoverStrategy
  //   );
  // }

export const APIAuthenticateService = {
  call: async (params: Payload, configuration: Configuration, logger: pino.Logger): Promise<AuthenticateResult> => {
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

    const fetcher = configuration.overrideFetch || fetch

    try {
      response = await fetcher()(requestUrl, requestOptions);
    } catch (err) {
      LoggerService.call({ requestUrl, requestOptions, err }, logger);

      if (isTimeout(err)) {
        // return FailoverResponsePrepareService.call(
        //   params.user_id,
        //   'server error',
        //   configuration.failoverStrategy
        // );
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
    }

    // Wait to get body here to prevent race conditions
    // on `.json()` because we attempt to read it in
    // multiple places.
    const body = await getBody(response);

    LoggerService.call(
      { requestUrl, requestOptions, response, body },
      logger
    );

    if (response.status >= 500) {
      // if (configuration.failoverStrategy === FailoverStrategy.throw) {
      //   throw 'server error';
      // }

      // return FailoverResponsePrepareService.call(
      //   params.user_id,
      //   'server error',
      //   configuration.failoverStrategy
      // );
    }

    this.handleUnauthorized(response);
    this.handleBadResponse(response);

    return body;
  },
};
