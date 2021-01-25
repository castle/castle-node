import { Configuration, Payload } from '../../models';
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
      sent_at: new Date(Date.now()).toISOString(),
      created_at,
      event,
      user_id,
      user_traits,
      properties,
      device_token,
      context: {
        ...context,
        ...defaultContext,
      },
    });
  },
};
