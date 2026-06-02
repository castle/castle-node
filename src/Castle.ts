import {
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
  APISearchEventsService,
  APIGetEventsSchemaService,
  APIGroupEventsService,
  APIRequestUserDataService,
  APIDeleteUserDataService,
  APIBatchUpsertListItemsService,
  APICountListItemsService,
} from './api/api.module';
import { FailoverStrategy } from './failover/failover.module';
import { WebhookVerifyService } from './webhook/webhook.module';
import { SecureModeService } from './secure-mode/secure-mode.module';
import type {
  LogPayload,
  FilterPayload,
  RiskPayload,
  CreateListItemPayload,
  CreateListPayload,
  UpdateListItemPayload,
  UpdateListPayload,
  ListItemPayload,
  ListPayload,
  SearchListItemsPayload,
  SearchListsPayload,
  SearchEventsPayload,
  SearchEventsResponse,
  GetEventsSchemaResponse,
  GroupEventsPayload,
  GroupEventsResponse,
  BatchUpsertListItemsPayload,
  CountListItemsPayload,
  DeleteUserDataPayload,
  RequestUserDataPayload,
} from './payload/payload.module';
import { Configuration, ConfigurationProperties } from './configuration';

export class Castle {
  public configuration: Configuration;

  constructor(configAttributes: ConfigurationProperties) {
    this.configuration = new Configuration(configAttributes);
  }

  public async risk(params: RiskPayload): Promise<object> {
    if (this.configuration.doNotTrack) {
      return this.generateDoNotTrackResponse(params.user?.id);
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

  public async batchUpdateListItems(
    params: BatchUpsertListItemsPayload
  ): Promise<any> {
    return APIBatchUpsertListItemsService.call(params, this.configuration);
  }

  public async countListItems(params: CountListItemsPayload): Promise<any> {
    return APICountListItemsService.call(params, this.configuration);
  }

  public async queryEvents(
    params: SearchEventsPayload
  ): Promise<SearchEventsResponse> {
    return APISearchEventsService.call(params, this.configuration);
  }

  public async eventsSchema(): Promise<GetEventsSchemaResponse> {
    return APIGetEventsSchemaService.call(this.configuration);
  }

  public async groupEvents(
    params: GroupEventsPayload
  ): Promise<GroupEventsResponse> {
    return APIGroupEventsService.call(params, this.configuration);
  }

  /** @deprecated Use {@link Castle.queryEvents} instead. */
  public async searchEvents(
    params: SearchEventsPayload
  ): Promise<SearchEventsResponse> {
    return this.queryEvents(params);
  }

  /** @deprecated Use {@link Castle.eventsSchema} instead. */
  public async getEventsSchema(): Promise<GetEventsSchemaResponse> {
    return this.eventsSchema();
  }

  public async requestUserData(params: RequestUserDataPayload): Promise<any> {
    return APIRequestUserDataService.call(params, this.configuration);
  }

  public async deleteUserData(params: DeleteUserDataPayload): Promise<any> {
    return APIDeleteUserDataService.call(params, this.configuration);
  }

  public verifyWebhookSignature(
    payload: string | Buffer,
    signature: string | undefined
  ): void {
    WebhookVerifyService.call(payload, signature, this.configuration);
  }

  public secureModeSignature(userId: string): string {
    return SecureModeService.call(userId, this.configuration);
  }

  private generateDoNotTrackResponse(userId?: string): {
    [key: string]: any;
  } {
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
