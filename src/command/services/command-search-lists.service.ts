import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import type { SearchListsPayload } from '../../payload/models';

export const CommandSearchListsService = {
  call: (
    controller,
    options: SearchListsPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      `lists/query`,
      options,
      'POST',
      configuration
    );
  },
};
