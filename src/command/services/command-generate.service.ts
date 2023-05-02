import { Configuration } from '../../configuration';
import {
  CoreGenerateDefaultHeadersService,
  CoreGenerateRequestBody,
} from '../../core/core.module';
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
      | UpdateListItemPayload
      | SearchListItemsPayload,
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
