import { Configuration } from '../../configuraton';
import { ContextSanitizeService } from '../../context/context.module';
import { Payload } from '../../payload/payload.module';
import { CommandGenerateService } from './command-generate.service';

export const CommandAuthenticateService = {
  call: (controller, options: Payload, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'authenticate',
      { ...options, ...{ context } },
      'POST',
      configuration
    );
  },
};
