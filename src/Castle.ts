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
  APICreateListService,
  APIUpdateListItemService,
  APIUpdateListService,
  APIArchiveListItemService,
  APIUnarchiveListItemService,
  APIDeleteListService,
  APISearchListItemsService,
  APISearchListsService,
  APIFetchListItemService,
  APIFetchListService,
  APIFetchAllListsService,
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
  CreateListPayload,
  UpdateListItemPayload,
  UpdateListPayload,
  ListItemPayload,
  ListPayload,
  SearchListItemsPayload,
  SearchListsPayload,
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
      return this.generateDoNotTrackResponse(params.user.id);
    }

    return APIRiskService.call(params, this.configuration);
  }

  public async filter(params: FilterPayload): Promise<object> {
    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse(params.matching_user_id);
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

  public async createList(params: CreateListPayload): Promise<any> {
    return APICreateListService.call(params, this.configuration);
  }

  public async updateListItem(params: UpdateListItemPayload): Promise<any> {
    return APIUpdateListItemService.call(params, this.configuration);
  }

  public async updateList(params: UpdateListPayload): Promise<any> {
    return APIUpdateListService.call(params, this.configuration);
  }

  public async archiveListItem(params: ListItemPayload): Promise<any> {
    return APIArchiveListItemService.call(params, this.configuration);
  }

  public async unarchiveListItem(params: ListItemPayload): Promise<any> {
    return APIUnarchiveListItemService.call(params, this.configuration);
  }

  public async deleteList(params: ListPayload): Promise<any> {
    return APIDeleteListService.call(params, this.configuration);
  }

  public async fetchListItem(params: ListItemPayload): Promise<any> {
    return APIFetchListItemService.call(params, this.configuration);
  }

  public async fetchList(params: ListPayload): Promise<any> {
    return APIFetchListService.call(params, this.configuration);
  }

  public async fetchAllLists(): Promise<any> {
    return APIFetchAllListsService.call(this.configuration);
  }

  public async searchListItems(params: SearchListItemsPayload): Promise<any> {
    return APISearchListItemsService.call(params, this.configuration);
  }

  public async searchLists(params: SearchListsPayload): Promise<any> {
    return APISearchListsService.call(params, this.configuration);
  }

  private generateDoNotTrackResponse(userId?): { [key: string]: any } {
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
