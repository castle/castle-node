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
} from './payload/payload.module';
import { Configuration, ConfigurationProperties } from './configuration';
import { ListItemPayload } from './payload/models/list_item_payload';

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
      return this.generateDoNotTrackResponse(params.user?.id);
    }

    return APIRiskService.call(params, this.configuration);
  }

  public async filter(params: FilterPayload): Promise<object> {
    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse(params.user?.id);
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

  public async createListItem(params: ListItemPayload): Promise<any> {
    return APICreateListItemService.call(params, this.configuration);
  }

  private generateDoNotTrackResponse(userId): object {
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
