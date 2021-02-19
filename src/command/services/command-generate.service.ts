import { Configuration } from '../../configuraton';
import {
  CoreGenerateDefaultHeadersService,
  CoreGenerateRequestBody,
} from '../../core/core.module';

export const CommandGenerateService = {
  call: (
    controller,
    path: string,
    options: any,
    method: string,
    configuration: Configuration
  ) => {
    return {
      requestUrl: new URL(path, configuration.baseUrl),
      requestOptions: {
        signal: controller.signal,
        method,
        headers: CoreGenerateDefaultHeadersService.call(configuration),
        body: CoreGenerateRequestBody.call(options, configuration),
      },
    };
  },
};
