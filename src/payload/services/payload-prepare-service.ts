import { deepMerge } from '../../utils/object';
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
      deepMerge(payloadParams, options),
      configuration
    );
    return deepMerge(payloadParams, { context });
  },
};
