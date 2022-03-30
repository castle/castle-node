import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextGetDefaultService } from './context-get-default.service';
import type { Request as ExpressRequest } from 'express';

export const ContextPrepareService = {
  call: (
    request: ExpressRequest,
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
