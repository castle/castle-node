import { Configuration } from '../../configuration';
import {
  CoreGenerateDefaultHeadersService,
  CoreGenerateRequestBody,
} from '../../core/core.module';
import {
  DeleteUserDataPayload,
  RequestUserDataPayload,
} from '../../payload/models/privacy_payload';
import {
  Payload,
  LogPayload,
  RiskPayload,
  FilterPayload,
  CreateListItemPayload,
  DevicePayload,
  UserDevicePayload,
  UpdateListItemPayload,
  ListItemPayload,
  SearchListItemsPayload,
  ListPayload,
  CreateListPayload,
  SearchListsPayload,
  UpdateListPayload,
  GroupEventsPayload,
  SearchEventsPayload,
} from '../../payload/payload.module';

const combineURLs = (baseURL, relativeURL) => {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

export const CommandGenerateService = {
  call: (
    controller,
    path: string,
    options:
      | Payload
      | DevicePayload
      | UserDevicePayload
      | LogPayload
      | RiskPayload
      | FilterPayload
      | CreateListItemPayload
      | ListItemPayload
      | ListPayload
      | UpdateListItemPayload
      | CreateListPayload
      | UpdateListPayload
      | SearchListsPayload
      | SearchListItemsPayload
      | GroupEventsPayload
      | SearchEventsPayload
      | RequestUserDataPayload
      | DeleteUserDataPayload,
    method: string,
    configuration: Configuration
  ) => {
    return {
      requestUrl: new URL(combineURLs(configuration.baseUrl.toString(), path)),
      requestOptions: {
        signal: controller.signal,
        method,
        headers: CoreGenerateDefaultHeadersService.call(configuration),
        ...(method !== 'GET' && {
          body: CoreGenerateRequestBody.call(options),
        }),
      },
    };
  },
};
