import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import pino from 'pino';

import { AuthenticateResult, Payload } from './models';
import { APIAuthenticateService } from './api/api.module';
import {
  CommandAuthenticateService,
  CommandTrackService,
} from './command/command.module';
import { CoreProcessResponseService } from './core/core.module';
import { FailoverResponsePrepareService } from './failover/failover.module';
import { LoggerService } from './logger/logger.module';
import { Configuration } from './configuraton';

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
      return this.generateDoNotTrackResponse(params.user_id);
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

    CoreProcessResponseService.call(
      requestUrl,
      requestOptions,
      response,
      this.logger
    );
  }

  private getFetch() {
    return this.configuration.overrideFetch || fetch;
  }

  private generateDoNotTrackResponse(userId) {
    return FailoverResponsePrepareService.call(
      userId,
      'do not track',
      this.configuration.failoverStrategy
    );
  }
}
