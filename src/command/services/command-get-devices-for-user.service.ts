import { Configuration } from '../../configuraton';
import { CommandGenerateService } from './command-generate.service';
import { Payload } from '../../payload/payload.module';

export const CommandGetDevicesForUserService = {
  call: (controller, options: Payload, configuration: Configuration) => {
    return CommandGenerateService.call(
      controller,
      `users/${options.user_id}/devices`,
      {},
      'GET',
      configuration
    );
  },
};
