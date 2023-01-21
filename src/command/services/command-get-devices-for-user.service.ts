import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { Payload } from '../../payload/payload.module';
import { ValidatorPresentService } from '../../validator/validator.module';

export const CommandGetDevicesForUserService = {
  call: (controller, options: Payload, configuration: Configuration) => {
    ValidatorPresentService.call(options, ['user_id']);

    return CommandGenerateService.call(
      controller,
      `users/${options.user_id}/devices`,
      {},
      'GET',
      configuration
    );
  },
};
