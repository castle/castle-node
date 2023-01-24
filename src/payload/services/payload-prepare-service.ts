import merge from 'lodash.merge';
import { Configuration } from '../../configuration';
import { ContextPrepareService } from '../../context/context.module';
import type { Request } from 'express';

export const PayloadPrepareService = {
  call: (
    payloadParams: { [key: string]: any },
    request: Request,
    configuration: Configuration,
    options: { [key: string]: any } = {}
  ) => {
    const context = ContextPrepareService.call(
      request,
      merge(payloadParams, options),
      configuration
    );
    return merge(payloadParams, { context });
  },
};
