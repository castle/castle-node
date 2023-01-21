import { Configuration } from '../../configuration';
import { ContextSanitizeService } from '../../context/context.module';
import { Payload } from '../../payload/payload.module';
import { CommandGenerateService } from './command-generate.service';

export const CommandTrackService = {
  call: (controller, options: Payload, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'track',
      { ...options, ...{ context } } as Payload,
      'POST',
      configuration
    );
  },
};
