import { Configuration } from '../../configuration';
import { ContextSanitizeService } from '../../context/context.module';
import { FilterPayload } from '../../payload/payload.module';
import { CommandGenerateService } from './command-generate.service';

export const CommandFilterService = {
  call: (controller, options: FilterPayload, configuration: Configuration) => {
    const context = ContextSanitizeService.call(options.context);
    return CommandGenerateService.call(
      controller,
      'filter',
      { ...options, ...{ context } } as FilterPayload,
      'POST',
      configuration
    );
  },
};
