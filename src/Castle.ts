import pino from 'pino';

import { AuthenticateResult, Payload } from './models';
import { APIAuthenticateService, APITrackService } from './api/api.module';
import { FailoverResponsePrepareService } from './failover/failover.module';
import { Configuration } from './configuraton';

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

    return APITrackService.call(params, this.configuration, this.logger);
  }

  private generateDoNotTrackResponse(userId) {
    return FailoverResponsePrepareService.call(
      userId,
      'do not track',
      this.configuration.failoverStrategy
    );
  }
}
