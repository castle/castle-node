import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import type { GroupEventsPayload } from '../../payload/models';

export const CommandGroupEventsService = {
  call: (
    controller,
    options: GroupEventsPayload,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'events/group',
      options,
      'POST',
      configuration
    );
  },
};
