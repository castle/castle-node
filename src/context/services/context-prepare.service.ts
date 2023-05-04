import merge from 'lodash.merge';
import { Configuration } from '../../configuration';
import { ContextGetDefaultService } from './context-get-default.service';
import type { IncomingHttpHeaders } from 'http2';

export const ContextPrepareService = {
  call: (
    request: { headers: IncomingHttpHeaders },
    options: undefined | { [key: string]: any },
    configuration: Configuration
  ) => {
    const defaultContext = ContextGetDefaultService.call(
      request,
      options?.cookies,
      configuration
    );
    return merge(defaultContext, options?.context);
  },
};
