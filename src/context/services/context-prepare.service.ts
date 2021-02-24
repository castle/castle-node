import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextGetDefaultService } from './context-get-default.service';

export const ContextPrepareService = {
  call: (requestContext: any, options: any, configuration: Configuration) => {
    const defaultContext = ContextGetDefaultService.call(
      requestContext,
      options.cookies,
      configuration
    );
    return merge(requestContext, defaultContext);
  },
};
