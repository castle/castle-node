import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { UserDevicePayload } from '../../payload/payload.module';
import { ValidatorPresentService } from '../../validator/validator.module';

export const CommandGetDevicesForUserService = {
  call: (
    controller,
    options: UserDevicePayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['id']);

    return CommandGenerateService.call(
      controller,
      `users/${options.id}/devices`,
      options,
      'GET',
      configuration
    );
  },
};
