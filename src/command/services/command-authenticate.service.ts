import { Configuration } from '../../models';
import { CommandGenerateService } from './command-generate.service';

export const CommandAuthenticateService = {
  call: (
    controller: AbortController,
    data: any,
    configuration: Configuration
  ) => {
    return CommandGenerateService.call(
      controller,
      'authenticate',
      data,
      'POST',
      configuration
    );
  },
};
