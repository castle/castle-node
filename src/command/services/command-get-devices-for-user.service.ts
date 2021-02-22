import { Configuration } from '../../configuraton';
import { CommandGenerateService } from './command-generate.service';

export const CommandGetDevicesForUserService = {
  call: (
    controller,
    options: { user_id: string },
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      `users/${options.user_id}/devices`,
      {},
      'GET',
      configuration
    );
  },
};
