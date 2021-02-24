import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextPrepareService } from '../../context/context.module';

export const PayloadPrepareService = {
  call: (
    payloadOptions: any,
    requestContext: any,
    configuration: Configuration,
    options: any = {}
  ) => {
    const context = ContextPrepareService.call(
      requestContext,
      merge(payloadOptions, options),
      configuration
    );
    return merge(payloadOptions, context);
  },
};
