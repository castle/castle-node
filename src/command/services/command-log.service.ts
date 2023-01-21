import { Configuration } from '../../configuration';
import { ContextSanitizeService } from '../../context/context.module';
import { LogPayload } from '../../payload/payload.module';
import { CommandGenerateService } from './command-generate.service';

export const CommandLogService = {
  call: (controller, options: LogPayload, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'log',
      { ...options, ...{ context } } as LogPayload,
      'POST',
      configuration
    );
  },
};
