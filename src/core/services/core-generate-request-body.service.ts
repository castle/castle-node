import { merge } from 'lodash';
import { Payload } from '../../models';
import { Configuration } from '../../configuraton';
import { ContextGetDefaultService } from '../../context/context.module';

export const CoreGenerateRequestBody = {
  call: (
    {
      event,
      user_id,
      user_traits,
      properties,
      context,
      created_at,
      device_token,
    }: Payload,
    configuration: Configuration
  ) => {
    const defaultContext = ContextGetDefaultService.call(
      context,
      configuration
    );
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      properties,
      device_token,
      context: merge(context, defaultContext),
    });
  },
};
