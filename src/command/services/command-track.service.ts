import { Configuration } from '../../configuraton';
import { CommandGenerateService } from './command-generate.service';

export const CommandTrackService = {
  call: (
    controller: AbortController,
    data: any,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'track',
      data,
      'POST',
      configuration
    );
  },
};
