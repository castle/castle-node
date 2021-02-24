import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextPrepareService } from '../../context/context.module';

export const PayloadPrepareService = {
  call: (
    payloadOptions: any,
    requestContext: any,
    configuration: Configuration
  ) => {
    const context = ContextPrepareService.call(requestContext, configuration);
    return merge(payloadOptions, context);
  },
};
