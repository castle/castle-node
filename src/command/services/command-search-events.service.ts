import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import type { SearchEventsPayload } from '../../payload/models';

export const CommandSearchEventsService = {
  call: (
    controller,
    options: SearchEventsPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'events/query',
      options,
      'POST',
      configuration
    );
  },
};
