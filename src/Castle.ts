import type { AuthenticateResult } from './models';
import {
  APIAuthenticateService,
  APIApproveDeviceService,
  APIGetDeviceService,
  APIGetDevicesForUserService,
  APIReportDeviceService,
  APITrackService,
  APILogService,
  APIFilterService,
  APIRiskService,
  APICreateListItemService,
} from './api/api.module';
import { FailoverStrategy } from './failover/failover.module';
import type {
  Payload,
  LogPayload,
  FilterPayload,
  RiskPayload,
  DevicePayload,
  UserDevicePayload,
  CreateListItemPayload,
} from './payload/payload.module';
import { Configuration, ConfigurationProperties } from './configuration';

export class Castle {
  public configuration: Configuration;

  constructor(configAttributes: ConfigurationProperties) {
    this.configuration = new Configuration(configAttributes);
  }

  public async authenticate(params: Payload): Promise<AuthenticateResult> {
    if (!params.event) {
      throw new Error('Castle: event is required when calling authenticate.');
    }

    if (this.configuration.doNotTrack) {
      return <AuthenticateResult>(
        this.generateDoNotTrackResponse(params.user_id)
      );
    }

    return APIAuthenticateService.call(params, this.configuration);
  }

  public async risk(params: RiskPayload): Promise<object> {
    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse();
    }

    return APIRiskService.call(params, this.configuration);
  }

  public async filter(params: FilterPayload): Promise<object> {
    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse();
    }

    return APIFilterService.call(params, this.configuration);
  }

  public async log(params: LogPayload): Promise<void> {
    if (this.configuration.doNotTrack) {
      return;
    }

    APILogService.call(params, this.configuration);
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

  public async getDevice({ device_token }: DevicePayload): Promise<any> {
    return APIGetDeviceService.call({ device_token }, this.configuration);
  }

  public async getDevicesForUser({ id, cid }: UserDevicePayload): Promise<any> {
    return APIGetDevicesForUserService.call({ id, cid }, this.configuration);
  }

  public async approveDevice({ device_token }: DevicePayload): Promise<any> {
    return APIApproveDeviceService.call({ device_token }, this.configuration);
  }

  public async reportDevice({ device_token }: DevicePayload): Promise<any> {
    return APIReportDeviceService.call({ device_token }, this.configuration);
  }

  public async createListItem(params: CreateListItemPayload): Promise<any> {
    return APICreateListItemService.call(params, this.configuration);
  }

  private generateDoNotTrackResponse(userId?): object {
    return {
      policy: {
        action: FailoverStrategy.allow,
      },
      action: FailoverStrategy.allow,
      user_id: userId,
      failover: true,
      failover_reason: 'do not track',
    };
  }
}
