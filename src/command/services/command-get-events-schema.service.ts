import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';

export const CommandGetEventsSchemaService = {
  call: (controller, configuration: Configuration) => {
    return CommandGenerateService.call(
      controller,
      'events/schema',
      {},
      'GET',
      configuration
    );
  },
};
