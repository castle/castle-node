import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextGetDefaultService } from '../../context/context.module';
import { Payload } from '../../payload/payload.module';

export const CoreGenerateRequestBody = {
  call: (
    { context, ...payloadOptions }: { [key: string]: any },
    configuration: Configuration
  ) => {
    const defaultContext = ContextGetDefaultService.call(
      context,
      '',
      configuration
    );
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      ...payloadOptions,
      context: merge(context, defaultContext),
    });
  },
};
