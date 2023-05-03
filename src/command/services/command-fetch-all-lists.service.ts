import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';

export const CommandFetchAllListsService = {
  call: (controller, configuration: Configuration) => {
    return CommandGenerateService.call(
      controller,
      `lists`,
      {},
      'GET',
      configuration
    );
  },
};
