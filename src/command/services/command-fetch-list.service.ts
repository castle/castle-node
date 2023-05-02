import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { ListPayload } from '../../payload/models';

export const CommandFetchListService = {
  call: (controller, options: ListPayload, configuration: Configuration) => {
    ValidatorPresentService.call(options, ['id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.id}`,
      {},
      'GET',
      configuration
    );
  },
};
