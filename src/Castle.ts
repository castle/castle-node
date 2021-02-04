import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import pino from 'pino';

import { AuthenticateResult, Payload } from './models';
import { APIAuthenticateService } from './api/api.module';
import {
  CommandTrackService,
} from './command/command.module';
import {
  FailoverResponsePrepareService,
  FailoverStrategy,
} from './failover/failover.module';
import { LoggerService } from './logger/logger.module';
import { Configuration } from './configuraton';

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

export class Castle {
  private logger: pino.Logger;
  private configuration: Configuration;

  constructor(configAttributes) {
    this.configuration = new Configuration(configAttributes);
    this.logger = pino({
      prettyPrint: {
        levelFirst: true,
      },
    });
    this.logger.level = this.configuration.logLevel;
  }

  public async authenticate(params: Payload): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    if (this.configuration.doNotTrack) {
      return FailoverResponsePrepareService.call(
        params.user_id,
        'do not track',
        this.configuration.failoverStrategy
      );
    }

    return APIAuthenticateService.call(params, this.configuration, this.logger);
  }

  public async track(params: Payload): Promise<void> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
    }

    if (this.configuration.doNotTrack) {
      return;
    }

    let response: Response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.configuration.timeout);
    const { requestUrl, requestOptions } = CommandTrackService.call(
      controller,
      params,
      this.configuration
    );

    try {
      response = await this.getFetch()(requestUrl, requestOptions);
    } catch (err) {
      if (isTimeout(err)) {
        return LoggerService.call(
          { requestUrl, requestOptions, err },
          this.logger
        );
      }
    } finally {
      clearTimeout(timeout);
    }

    LoggerService.call({ requestUrl, requestOptions, response }, this.logger);
    this.handleUnauthorized(response);
    this.handleBadResponse(response);
  }

  private getFetch() {
    return this.configuration.overrideFetch || fetch;
  }

  private handleUnauthorized(response: Response) {
    if (response.status === 401) {
      throw new Error(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    }
  }

  private handleBadResponse(response: Response) {
    if (response.status >= 400 && response.status < 500) {
      throw new Error(`Castle: API response not ok, got ${response.status}.`);
    }
  }
}
