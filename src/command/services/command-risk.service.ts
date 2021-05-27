import { Configuration } from '../../configuraton';
import { ContextSanitizeService } from '../../context/context.module';
import { CommandGenerateService } from './command-generate.service';

export const CommandRiskService = {
  call: (controller, options: object, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'risk',
      { ...options, ...{ context } },
      'POST',
      configuration
    );
  },
};
