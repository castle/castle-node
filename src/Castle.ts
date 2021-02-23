import { AuthenticateResult, Payload } from './models';
import {
  APIAuthenticateService,
  APIApproveDeviceService,
  APIGetDeviceService,
  APIGetDevicesForUserService,
  APIReportDeviceService,
  APITrackService,
} from './api/api.module';
import { FailoverResponsePrepareService } from './failover/failover.module';
import { Configuration } from './configuraton';

export class Castle {
  private configuration: Configuration;

  constructor(configAttributes) {
    this.configuration = new Configuration(configAttributes);
  }

  public async authenticate(params: Payload): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse(params.user_id);
    }

    return APIAuthenticateService.call(params, this.configuration);
  }

  public async track(params: Payload): Promise<void> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling track.');
    }

    if (this.configuration.doNotTrack) {
      return;
    }

    return APITrackService.call(params, this.configuration);
  }

  public async getDevice({ device_token }: Payload): Promise<any> {
    return APIGetDeviceService.call({ device_token }, this.configuration);
  }

  public async getDevicesForUser({ user_id }: Payload): Promise<any> {
    return APIGetDevicesForUserService.call({ user_id }, this.configuration);
  }

  public async approveDevice({ device_token }: Payload): Promise<any> {
    return APIApproveDeviceService.call({ device_token }, this.configuration);
  }

  public async reportDevice({ device_token }: Payload): Promise<any> {
    return APIReportDeviceService.call({ device_token }, this.configuration);
  }

  private generateDoNotTrackResponse(userId) {
    return FailoverResponsePrepareService.call(
      userId,
      'do not track',
      this.configuration.failoverStrategy
    );
  }
}
