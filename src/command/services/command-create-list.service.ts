import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import type { CreateListPayload } from '../../payload/models';

export const CommandCreateListService = {
  call: (
    controller,
    options: CreateListPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      `lists`,
      options,
      'POST',
      configuration
    );
  },
};
