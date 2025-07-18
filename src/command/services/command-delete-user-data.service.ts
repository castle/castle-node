import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { DeleteUserDataPayload } from '../../payload/models/privacy_payload';

export const CommandDeleteUserDataService = {
  call: (
    controller,
    options: DeleteUserDataPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'privacy/users',
      options,
      'DELETE',
      configuration
    );
  },
};
