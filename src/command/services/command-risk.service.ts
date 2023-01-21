import { Configuration } from '../../configuration';
import { ContextSanitizeService } from '../../context/context.module';
import { CommandGenerateService } from './command-generate.service';
import { RiskPayload } from '../../payload/payload.module';

export const CommandRiskService = {
  call: (controller, options: RiskPayload, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'risk',
      { ...options, ...{ context } } as RiskPayload,
      'POST',
      configuration
    );
  },
};
