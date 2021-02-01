import { Configuration } from '../../configuraton';
import {
  CoreGenerateDefaultHeadersService,
  CoreGenerateRequestBody,
} from '../../core/core.module';

export const CommandGenerateService = {
  call: (
    controller: AbortController,
    path: string,
    data: any,
    method: string,
    configuration: Configuration
  ) => {
    return {
      requestUrl: `${configuration.baseUrl}/${path}`,
      requestOptions: {
        signal: controller.signal,
        method,
        headers: CoreGenerateDefaultHeadersService.call(configuration),
        body: CoreGenerateRequestBody.call(data, configuration),
      },
    };
  },
};
