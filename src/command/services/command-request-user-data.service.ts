import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { RequestUserDataPayload } from '../../payload/models/privacy_payload';

export const CommandRequestUserDataService = {
  call: (
    controller,
    options: RequestUserDataPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'privacy/users',
      options,
      'POST',
      configuration
    );
  },
};
