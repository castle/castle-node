import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { UpdateListPayload } from '../../payload/models';

export const CommandUpdateListService = {
  call: (
    controller,
    options: UpdateListPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.id}`,
      options,
      'PUT',
      configuration
    );
  },
};
