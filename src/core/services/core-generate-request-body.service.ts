import { Configuration } from '../../configuraton';
import { ContextPrepareService } from '../../context/context.module';
import { Payload } from '../../payload/payload.module';

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
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      properties,
      device_token,
      context: ContextPrepareService.call(context, {}, configuration),
    });
  },
};
