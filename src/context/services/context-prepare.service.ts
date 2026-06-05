import { deepMerge } from '../../utils/object';
import { Configuration } from '../../configuration';
import { ContextGetDefaultService } from './context-get-default.service';
import type { CastleRequest } from './request';

export const ContextPrepareService = {
  call: (
    request: CastleRequest,
    options: undefined | { [key: string]: any },
    configuration: Configuration
  ) => {
    const defaultContext = ContextGetDefaultService.call(
      request,
      options?.cookies,
      configuration
    );
    return deepMerge(defaultContext, options?.context);
  },
};
